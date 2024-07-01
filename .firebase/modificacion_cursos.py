import json
import os

# Imprimir el directorio de trabajo actual
print("Directorio de trabajo actual:", os.getcwd())

# Obtener la ruta del directorio del script
script_dir = os.path.dirname(os.path.abspath(__file__))
print("Directorio del script:", script_dir)


# Función para cambiar pdf a Info
def change_pdf_to_info(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if key == "tipo" and value == "pdf":
                data[key] = "Info"
            elif isinstance(value, (dict, list)):
                change_pdf_to_info(value)
    elif isinstance(data, list):
        for item in data:
            change_pdf_to_info(item)


# Construir la ruta completa al archivo de entrada
input_file = os.path.join(script_dir, "cursos_modificados.json")
print("Intentando abrir:", input_file)

# Leer el archivo JSON original
try:
    with open(input_file, "r", encoding="utf-8") as file:
        data = json.load(file)
except FileNotFoundError:
    print(f"Error: No se pudo encontrar el archivo '{input_file}'")
    print(
        "Asegúrate de que el archivo 'cursos_modificados.json' esté en el mismo directorio que este script."
    )
    exit(1)

# Cambiar pdf a Info
change_pdf_to_info(data)

# Construir la ruta completa al archivo de salida
output_file = os.path.join(script_dir, "cursos_modificados2.json")

# Guardar el JSON modificado
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False, indent=2)

print(f"Archivo '{output_file}' creado con éxito.")
