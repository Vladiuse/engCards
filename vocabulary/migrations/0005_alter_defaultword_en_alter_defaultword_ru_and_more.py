# Generated by Django 5.0.4 on 2025-02-27 09:21

import vocabulary.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("vocabulary", "0004_sentence"),
    ]

    operations = [
        migrations.AlterField(
            model_name="defaultword",
            name="en",
            field=vocabulary.fields.EngCharField(max_length=100),
        ),
        migrations.AlterField(
            model_name="defaultword",
            name="ru",
            field=vocabulary.fields.RuCharField(max_length=100),
        ),
        migrations.AlterField(
            model_name="sentence",
            name="en",
            field=vocabulary.fields.EngCharField(max_length=255),
        ),
        migrations.AlterField(
            model_name="sentence",
            name="ru",
            field=vocabulary.fields.RuCharField(max_length=255),
        ),
        migrations.AlterField(
            model_name="wordpair",
            name="en",
            field=vocabulary.fields.EngCharField(max_length=100),
        ),
        migrations.AlterField(
            model_name="wordpair",
            name="ru",
            field=vocabulary.fields.RuCharField(max_length=100),
        ),
        migrations.AlterField(
            model_name="wordpair",
            name="status",
            field=models.CharField(
                choices=[
                    ("learned", "Выучено"),
                    ("learning", "Изучаю"),
                    ("postponed", "Отложено"),
                ],
                default="learning",
                max_length=20,
            ),
        ),
    ]
