def handler(event, context):
    counts = 0
    for x in event:
        for y in x:
            print(f"the event is {y}")
            counts+=1
    return {"count":counts}
