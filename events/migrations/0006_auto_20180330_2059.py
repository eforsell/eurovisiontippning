# Generated by Django 2.0.3 on 2018-03-30 18:59

from django.db import migrations, models
import django.db.models.deletion
import django_countries.fields


class Migration(migrations.Migration):

    dependencies = [
        ('media', '0003_auto_20180324_2236'),
        ('events', '0005_semifinal_progression_count'),
    ]

    operations = [
        migrations.CreateModel(
            name='FinalEntry',
            fields=[
                ('entry_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='events.Entry')),
                ('contest', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.Final')),
            ],
            bases=('events.entry',),
        ),
        migrations.CreateModel(
            name='Participant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country', django_countries.fields.CountryField(max_length=2)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.Event')),
                ('song', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='media.Song')),
            ],
            options={
                'verbose_name_plural': 'entries',
            },
        ),
        migrations.CreateModel(
            name='SemiEntry',
            fields=[
                ('entry_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='events.Entry')),
                ('contest', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.SemiFinal')),
            ],
            bases=('events.entry',),
        ),
        migrations.RemoveField(
            model_name='entryscore',
            name='contest',
        ),
        migrations.RemoveField(
            model_name='entryscore',
            name='entry',
        ),
        migrations.AlterModelOptions(
            name='entry',
            options={},
        ),
        migrations.RemoveField(
            model_name='entry',
            name='country',
        ),
        migrations.RemoveField(
            model_name='entry',
            name='event',
        ),
        migrations.RemoveField(
            model_name='entry',
            name='song',
        ),
        migrations.AddField(
            model_name='entry',
            name='points',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='entry',
            name='rank',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='entry',
            name='start_order',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.DeleteModel(
            name='EntryScore',
        ),
        migrations.AddField(
            model_name='entry',
            name='participant',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='events.Participant'),
            preserve_default=False,
        ),
    ]
