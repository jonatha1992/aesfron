import { useEffect, useState } from "react";
import { getModulos, agregarModulo, eliminarModulo, actualizarModulo } from "../controllers/controllerModulo";
import {
    Box,
    Backdrop,
    CircularProgress,
    List,
    ListItem,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItemText,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ItemModulo from "./ItemModulo.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ListaModulos({ cursoId }) {
    const [modulos, setModulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [moduloToDelete, setModuloToDelete] = useState(null);
    const [newModuloTitle, setNewModuloTitle] = useState("");
    const [editingModulo, setEditingModulo] = useState(null);

    useEffect(() => {
        fetchModulos();
    }, [cursoId]);

    const fetchModulos = async () => {
        setLoading(true);
        try {
            const modulosData = await getModulos(cursoId);
            setModulos(modulosData);
        } catch (error) {
            console.error("Error al obtener los módulos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddModulo = async () => {
        if (newModuloTitle.trim()) {
            try {
                await agregarModulo(cursoId, { titulo: parseInt(newModuloTitle) });
                setNewModuloTitle("");
                setOpenDialog(false);
                fetchModulos();
                toast.success("Módulo agregado exitosamente");
            } catch (error) {
                console.error("Error al agregar módulo:", error);
                toast.error(error.message || "Error al agregar módulo");
            }
        }
    };

    const handleEditModulo = async () => {
        if (editingModulo && editingModulo.titulo) {
            try {
                await actualizarModulo(cursoId, editingModulo.id, { titulo: parseInt(editingModulo.titulo) });
                setEditingModulo(null);
                fetchModulos();
                toast.success("Módulo editado exitosamente");
            } catch (error) {
                console.error("Error al editar módulo:", error);
                toast.error("Error al editar módulo");
            }
        }
    };

    const handleDeleteClick = (modulo) => {
        setModuloToDelete(modulo);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (moduloToDelete) {
            try {
                await eliminarModulo(cursoId, moduloToDelete.id);
                fetchModulos();
                toast.success("Módulo eliminado exitosamente");
            } catch (error) {
                console.error("Error al eliminar módulo:", error);
                toast.error("Error al eliminar módulo");
            } finally {
                setOpenDeleteDialog(false);
                setModuloToDelete(null);
            }
        }
    };

    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false);
        setModuloToDelete(null);
    };

    const mostrarToast = (message, type) => {
        toast[type](message);
    };

    return (
        <Box>
            <ToastContainer autoClose={2000} />

            <Backdrop open={loading} style={{ zIndex: 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {!loading && (
                <div>
                    <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)} sx={{ margin: "5px 0" }}>
                        Agregar Unidad
                    </Button>
                    <List>
                        {modulos.map((modulo) => (
                            <Accordion key={modulo.id}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <ListItem
                                        sx={{
                                            borderRadius: "8px",
                                            border: "1px solid var(--color1)",
                                            margin: "8px 0",
                                            transition: "background 0.3s ease",
                                            "&:hover": {
                                                background: "var(--color2)",
                                                color: "white",
                                            },
                                        }}
                                    >
                                        {editingModulo && editingModulo.id === modulo.id ? (
                                            <>
                                                <TextField
                                                    type="number"
                                                    value={editingModulo.titulo}
                                                    onChange={(e) => setEditingModulo({ ...editingModulo, titulo: e.target.value })}
                                                />
                                                <Button onClick={handleEditModulo}>Guardar</Button>
                                                <Button onClick={() => setEditingModulo(null)}>Cancelar</Button>
                                            </>
                                        ) : (
                                            <>
                                                <ListItemText primary={`Unidad  ${modulo.titulo}`} />
                                                <IconButton onClick={() => setEditingModulo(modulo)} color="primary">
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteClick(modulo)} color="secondary">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </>
                                        )}
                                    </ListItem>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ItemModulo
                                        cursoId={cursoId}
                                        moduloId={modulo.id}
                                        items={modulo.items || []}
                                        onUpdate={fetchModulos}
                                        mostrarToast={mostrarToast}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </List>
                </div>
            )}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <div style={{ padding: "16px" }}>
                    <h3 className="text-center mt-3">Agregar Unidad</h3>

                    <TextField
                        type="number"
                        value={newModuloTitle}
                        onChange={(e) => setNewModuloTitle(e.target.value)}
                        label="Número de la nueva unidad"
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", margin: "16px" }}>
                    <Button onClick={handleAddModulo}>Agregar</Button>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                </div>
            </Dialog>
            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirmar eliminación"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Estás seguro de que quieres eliminar la Unidad {moduloToDelete?.titulo}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancelar</Button>
                    <Button onClick={handleDeleteConfirm} autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
