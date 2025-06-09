from django.core.management.base import BaseCommand
from cards.models import PokemonCard
import csv

class Command(BaseCommand):
    help = 'Import Pokémon cards from a CSV file'

    def handle(self, *args, **options):
        PokemonCard.objects.all().delete()
        self.stdout.write(self.style.WARNING("Deleted all existing PokemonCard entries."))

        with open('./media/csv/all_cards_data.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Prepare values
                card_name = row['card_name']
                expansion = row['expansion'] or None
                illustrator = row['illustrator'] or None
                attack_1_name = row['attack_1_name'] or None
                attack_1_energy_cost = row['attack_1_energy_cost'] or None
                attack_2_name = row['attack_2_name'] or None
                attack_2_energy_cost = row['attack_2_energy_cost'] or None
                evolution_line = row['evolution_line'] or None
                
                # Fields to check with max_length=100 in your model
                fields_to_check = {
                    'card_name': card_name,
                    'expansion': expansion,
                    'illustrator': illustrator,
                    'attack_1_name': attack_1_name,
                    'attack_1_energy_cost': attack_1_energy_cost,
                    'attack_2_name': attack_2_name,
                    'attack_2_energy_cost': attack_2_energy_cost,
                    'evolution_line': evolution_line,
                }
                
                # Check lengths before saving
                for field, value in fields_to_check.items():
                    if value and len(value) > 100:
                        self.stdout.write(self.style.WARNING(
                            f"WARNING: Value too long for {field}: {len(value)} characters. Value: {value[:50]}..."
                        ))

                # Now create the object after checks
                PokemonCard.objects.create(
                    card_name=card_name,
                    card_number=row['card_number'] or None,
                    expansion=expansion,
                    rarity=row['rarity'] or None,
                    illustrator=illustrator,
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
                    attack_1_name=attack_1_name,
                    attack_1_points=int(row['attack_1_points']) if row['attack_1_points'].isdigit() else None,
                    attack_1_energy_cost=attack_1_energy_cost,
                    attack_1_description=row['attack_1_description'] or None,
                    attack_2_name=attack_2_name,
                    attack_2_points=int(row['attack_2_points']) if row['attack_2_points'].isdigit() else None,
                    attack_2_energy_cost=attack_2_energy_cost,
                    attack_2_description=row['attack_2_description'] or None,
                    weakness_type=row['weakness_type'] or None,
                    weakness_calc=row['weakness_calc'] or None,
                    strength_type=row['strength_type'] or None,
                    strength_calc=row['strength_calc'] or None,
                    escape_cost=int(row['escape_cost']) if row['escape_cost'].isdigit() else None,
                    evolution_line=evolution_line,
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported all cards.'))

