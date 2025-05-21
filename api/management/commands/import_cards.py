from django.core.management.base import BaseCommand
from api.models import PokemonCard
import csv

class Command(BaseCommand):
    help = 'Import Pokémon cards from a CSV file'

    def handle(self, *args, **options):
        with open('./media/csv/all_cards_data.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                PokemonCard.objects.create(
                    card_name=row['card_name'],
                    card_number=row['card_number'] or None,
                    expansion=row['expansion'] or None,
                    rarity=row['rarity'] or None,
                    illustrator=row['illustrator'] or None,
                    image_url=row['image_url'] or None,
                    card_type=row['card_type'] or None,
                    special_rule=row['special_rule'] or None,
                    is_ace_spec=row['is_ace_spec'].lower() == 'true' if row['is_ace_spec'] else False,
                    item_content=row['item_content'] or None,
                    supporter_content=row['supporter_content'] or None,
                    stadium_content=row['stadium_content'] or None,
                    tool_content=row['tool_content'] or None,
                    special_energy_content=row['special_energy_content'] or None,
                    basic_energy=row['basic_energy'] or None,
                    supertype=row['supertype'] or None,
                    hp_num=int(row['hp_num']) if row['hp_num'].isdigit() else None,
                    hp_type=row['hp_type'] or None,
                    ability_name=row['ability_name'] or None,
                    ability_content=row['ability_content'] or None,
                    attack_1_name=row['attack_1_name'] or None,
                    attack_1_points=int(row['attack_1_points']) if row['attack_1_points'].isdigit() else None,
                    attack_1_energy_cost=row['attack_1_energy_cost'] or None,
                    attack_1_description=row['attack_1_description'] or None,
                    attack_2_name=row['attack_2_name'] or None,
                    attack_2_points=int(row['attack_2_points']) if row['attack_2_points'].isdigit() else None,
                    attack_2_energy_cost=row['attack_2_energy_cost'] or None,
                    attack_2_description=row['attack_2_description'] or None,
                    weakness_type=row['weakness_type'] or None,
                    weakness_calc=row['weakness_calc'] or None,
                    strength_type=row['strength_type'] or None,
                    strength_calc=row['strength_calc'] or None,
                    escape_cost=int(row['escape_cost']) if row['escape_cost'].isdigit() else None,
                    evolution_line=row['evolution_line'] or None,
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported all cards.'))
