def handler(event, context):
    id = event.get("id")
    print(f"from lambda 1 {id}")
    return None