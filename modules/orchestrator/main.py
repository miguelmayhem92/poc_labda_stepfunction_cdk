import uuid

def handler(event, context):
    result = {
        "1": [{"id":str(uuid.uuid4())} for i in range(9)],
        "2": [{"id":str(uuid.uuid4())} for i in range(10)]
    }
    return result