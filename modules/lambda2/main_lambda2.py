def handler(event, context):
    id = event.get("id")
    print(f"from lambda 2 {id}")
    return None