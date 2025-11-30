#────────────────────────────────────────────────────────#
#                                                        #
# models.py                                              #   
# Defines the tables for time series in the database     #
#                                                        #
# Author: Jo Richmond                                    #
#                                                        #
#────────────────────────────────────────────────────────#

from django.db import models

class Series(models.Model):
    """
    A named time series. You can have multiple series (e.g., 'sales', 'temp_sensor_1').
    """
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class DataPoint(models.Model):
    series = models.ForeignKey(Series, related_name="points", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(db_index=True)
    value = models.FloatField()

    class Meta:
        unique_together = ("series", "timestamp")
        ordering = ["timestamp"]
