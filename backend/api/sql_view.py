#────────────────────────────────────────────────────────#
#                                                        #
# sql_view.py                                            #   
# Creates a view for direct SQL usage for the database   #
# and protects against SQL injection, dangerous          #
# statement types, and multiple statements.              #
#                                                        #
# Author: Jo Richmond                                    #
#                                                        #
#────────────────────────────────────────────────────────#

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
import json
import re

ALLOWED_TABLES = ["series", "points"]

BLOCKED_PATTERNS = [
    r"\balter\b",
    r"\btruncate\b",
    r"\bupdate\b",
    r"\bgrant\b",
    r"\brevoke\b",
    r"\drop\b",
    r"\bcreate\b",
    r";",  # prevent multiple statements
]

def is_safe(sql):
    for pat in BLOCKED_PATTERNS:
        if re.search(pat, sql, re.IGNORECASE):
            return False
    return True

def table_allowed(sql):
    sql_lower = sql.lower()
    return any(tbl in sql_lower for tbl in ALLOWED_TABLES)


@csrf_exempt
def execute_sql(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    try:
        body = json.loads(request.body)
        sql = body.get("sql")
        qtype = body.get("type")

        if not sql or not qtype:
            return JsonResponse({"error": "Missing SQL or type"}, status=400)

        if not is_safe(sql):
            return JsonResponse({"error": "Blocked keywords detected"}, status=403)

        if not table_allowed(sql):
            return JsonResponse({"error": "Query targets forbidden table"}, status=403)

        with connection.cursor() as cursor:
            cursor.execute(sql)

            if qtype.upper() == "SELECT":
                cols = [col[0] for col in cursor.description]
                rows = cursor.fetchall()
                data = [dict(zip(cols, row)) for row in rows]
                return JsonResponse({"rows": data, "rowCount": len(data)})

            return JsonResponse({"success": True})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
