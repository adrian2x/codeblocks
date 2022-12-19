# codeblocks
Note: this project is compatible with **Python 3.9**. Please use that version.

Set the local python version with `pyenv local 3.9` on the root directory.

Create a venv
```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Build the frontend code:
```
cd server/frontend/
npm install
npm run build
```

To run the server (make sure to run from the project top level directory):
```
flask run
```
