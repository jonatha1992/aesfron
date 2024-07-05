import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CursosInscriptos } from "../firebase";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";

export default function MisCursos() {
  const [cursos, setCursos] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCursos = async () => {
      if (user && user.uid) {
        try {
          const cursosData = await CursosInscriptos(user.uid);
          setCursos(cursosData);
        } catch (error) {
          console.error("Error fetching cursos:", error);
        }
      }
    };

    fetchCursos();
  }, [user]);

  return (
    <div>
      <h2>Mis Cursos</h2>
      <Grid container spacing={2}>
        {cursos.map((curso) => (
          <Grid item xs={12} sm={6} md={4} key={curso.inscripcionid}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {curso.detalles?.titulo || "Título no disponible"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {curso.detalles?.descripcion || "Descripción no disponible"}
                </Typography>
                <img
                  src={curso.detalles?.imageUrl || "URL de imagen por defecto"}
                  alt={curso.detalles?.titulo || "Imagen del curso"}
                  style={{ width: "100%", height: "auto" }}
                />
                <Button variant="contained" color="primary">
                  Ver Curso
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
