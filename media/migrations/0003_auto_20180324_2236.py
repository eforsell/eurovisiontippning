# Generated by Django 2.0.3 on 2018-03-24 21:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('media', '0002_auto_20180324_2235'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artist',
            name='spotify',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='media.SpotifyMedia'),
        ),
        migrations.AlterField(
            model_name='song',
            name='spotify',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='media.SpotifyMedia'),
        ),
        migrations.AlterField(
            model_name='song',
            name='youtube',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='media.YoutubeMedia'),
        ),
    ]
