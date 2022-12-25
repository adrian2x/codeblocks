from server import app


@app.get("/_ah/warmup")
def _warmup():
    # Google app engine warmup
    return "OK"
