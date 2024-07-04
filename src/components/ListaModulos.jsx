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
import { toast } from "react-toastify";

export default function ListaModulos({ cursoId }) {
    const [modulos, setModulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [newModuloTitle, setNewModuloTitle] = useState("");
    const [editingModulo, setEditingModulo] = useState(null);

    useEffect(() => {
        fetchModulos();
    }, [cursoId]);

    const fetchModulos = async () => {
        setLoading(true);
        try {
            const modulosData = await getModulos(cursoId);
            console.log("modulosData: ", modulosData);
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
            } catch (error) {
                console.error("Error al editar módulo:", error);
            }
        }
    };

    const handleDeleteModulo = async (moduloId) => {
        try {
            await eliminarModulo(cursoId, moduloId);
            fetchModulos();
        } catch (error) {
            console.error("Error al eliminar módulo:", error);
        }
    };

    return (
        <Box>
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
                                                <IconButton onClick={() => handleDeleteModulo(modulo.id)} color="secondary">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </>
                                        )}
                                    </ListItem>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ItemModulo cursoId={cursoId} moduloId={modulo.id} items={modulo.items || []} onUpdate={fetchModulos} />
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
        </Box>
    );
}
