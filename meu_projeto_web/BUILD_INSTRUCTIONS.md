Guia rápido para criar um executável do projeto

Resumo:
- O projeto é uma pequena API Flask com arquivos estáticos (index.html, script.js, style.css).
- Usaremos PyInstaller para empacotar `backend.py` em um executável Windows.

Passos:

1. Abra um terminal na pasta do projeto (onde está `backend.py`).

2. Execute o script de build (Windows):

```
build_exe.bat
```

Ou rode manualmente:

```
python -m pip install --upgrade pip
pip install pyinstaller
pyinstaller --noconfirm --onefile --add-data "index.html;." --add-data "script.js;." --add-data "style.css;." backend.py
```

Observações importantes:
- O código foi adaptado para empacotamento: arquivos estáticos são servidos a partir do bundle extraído, enquanto o banco de dados `vet_clinic.db` será criado ao lado do executável (para persistência).
- Quando empacotado em `--onefile`, PyInstaller extrai arquivos em tempo de execução para uma pasta temporária. Por isso o app serve arquivos estáticos a partir desse bundle, mas o DB fica no diretório do executável.
- Se preferir que todos os arquivos (incluindo DB) fiquem numa pasta, troque `--onefile` por `--onedir` no comando do PyInstaller.
- Teste o executável abrindo `dist\backend.exe` e acesse `http://localhost:5000` no navegador.

Problemas comuns:
- Erro ao localizar arquivos estáticos: verifique se `--add-data` incluiu os arquivos corretos.
- DB criado em pasta temporária e sumindo após reinício: use `--onedir` ou ajuste caminhos conforme desejado.
