# Generated by Django 2.0.3 on 2018-04-12 05:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0009_auto_20180408_2315'),
    ]

    operations = [
        migrations.AddField(
            model_name='final',
            name='has_semi_entries',
            field=models.BooleanField(default=False),
        ),
    ]
