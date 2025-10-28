def handler(event, context):
    id = event.get("id")
    print(f"from lambda 1 {id}")
    return {"event_key": f"lambda_1_{id}"}