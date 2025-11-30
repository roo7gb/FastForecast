#────────────────────────────────────────────────────────#
#                                                        #
# import_csv.py                                          #   
# Script to import csv files to the database from CLI    #
#                                                        #
# Author: Jo Richmond                                    #
#                                                        #
#────────────────────────────────────────────────────────#

from django.core.management.base import BaseCommand
from api.models import Series, DataPoint
import pandas as pd
from django.utils.dateparse import parse_datetime

class Command(BaseCommand):
    help = "Import CSV time series data"

    def add_arguments(self, parser):
        parser.add_argument("series_name", type=str)
        parser.add_argument("description", type=str, nargs="?", default="")
        parser.add_argument("csv_path", type=str)

    def handle(self, *args, **options):
        series_name = options["series_name"]
        description = options["description"]
        csv_path = options["csv_path"]

        df = pd.read_csv(csv_path)
        if "timestamp" not in df.columns or "value" not in df.columns:
            self.stderr.write("CSV must contain 'timestamp' and 'value' columns.")
            return

        series, _ = Series.objects.get_or_create(name=series_name, description=description)

        records = []
        for _, row in df.iterrows():
            ts = parse_datetime(str(row["timestamp"]))
            val = float(row["value"])
            records.append(DataPoint(series=series, timestamp=ts, value=val))

        DataPoint.objects.bulk_create(records, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f"Imported {len(records)} points into '{series_name}'"))
