from django.db import models

class PokemonCard(models.Model):
    card_name = models.CharField(max_length=100)
    card_number = models.CharField(max_length=20, blank=True, null=True)
    expansion = models.CharField(max_length=100, blank=True, null=True)
    rarity = models.CharField(max_length=50, blank=True, null=True)
    illustrator = models.CharField(max_length=100, blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)

    card_type = models.CharField(max_length=50, blank=True, null=True)
    special_rule = models.TextField(blank=True, null=True)
    is_ace_spec = models.BooleanField(default=False)

    item_content = models.TextField(blank=True, null=True)
    supporter_content = models.TextField(blank=True, null=True)
    stadium_content = models.TextField(blank=True, null=True)
    tool_content = models.TextField(blank=True, null=True)
    special_energy_content = models.TextField(blank=True, null=True)
    basic_energy = models.CharField(max_length=50, blank=True, null=True)
    supertype = models.CharField(max_length=50, blank=True, null=True)

    hp_num = models.PositiveIntegerField(blank=True, null=True)
    hp_type = models.CharField(max_length=50, blank=True, null=True)

    ability_name = models.CharField(max_length=100, blank=True, null=True)
    ability_content = models.TextField(blank=True, null=True)

    attack_1_name = models.CharField(max_length=100, blank=True, null=True)
    attack_1_points = models.PositiveIntegerField(blank=True, null=True)
    attack_1_energy_cost = models.CharField(max_length=100, blank=True, null=True)
    attack_1_description = models.TextField(blank=True, null=True)

    attack_2_name = models.CharField(max_length=100, blank=True, null=True)
    attack_2_points = models.PositiveIntegerField(blank=True, null=True)
    attack_2_energy_cost = models.CharField(max_length=100, blank=True, null=True)
    attack_2_description = models.TextField(blank=True, null=True)

    weakness_type = models.CharField(max_length=50, blank=True, null=True)
    weakness_calc = models.CharField(max_length=20, blank=True, null=True)

    strength_type = models.CharField(max_length=50, blank=True, null=True)
    strength_calc = models.CharField(max_length=20, blank=True, null=True)

    escape_cost = models.PositiveIntegerField(blank=True, null=True)
    evolution_line = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.card_name
