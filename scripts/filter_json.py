import json
import re

def clean_subcategory(subcategory):
    # Remove quantity information using regex
    return re.sub(r'\s*-\s*(?:Box|Pack|Case)\s+[Oo]f\s+\d+', '', subcategory).strip()

def process_json(input_file, output_file):
    # Read the input JSON file
    with open(input_file, 'r') as f:
        data = json.load(f)

    # Define the new categories and their corresponding IDs
    new_categories = {
        "First Aid": [
            "9556377076004", "9617116463396", "9495513268516", "9329344610596",
            "9580044321060", "9496103354660", "9557986541860", "9601869381924",
            "9329368105252", "9513496019236", "9329342415140", "9329352507684",
            "9556370030884", "9557987885348", "9497644728612", "9549577781540",
            "9381928141092", "9381927485732", "9495879057700", "9601863844132",
            "9557975957796", "9329380720932", "9329380393252", "9329368989988",
            "9329343856932", "9495588995364", "9556567982372", "9329346117924",
            "9329380524324", "9617200677156"
        ],
        "Airway": [
            "9595758182692", "9420172230948", "9420177539364", "9329329733924",
            "9595389935908", "9334167306532", "9329386848548", "9595417166116",
            "9329332158756", "9329386717476", "9596157362468", "9334252011812",
            "9512061862180", "9329336680740", "9595304247588", "9596159197476",
            "9595262566692", "9361082188068", "9334138536228", "9329370333476",
            "9595598831908", "9595429519652", "9595510227236", "9329385898276",
            "9329386094884", "9334349824292", "9329381245220", "9329385472292",
            "9513540419876", "9617065804068", "9329313644836"
        ],
        "Needle": [
            "9609307455780", "9432996380964", "9617220829476", "9566443307300",
            "9566428234020", "9353521201444", "9353521430820", "9523636207908",
            "9420185010468", "9609364734244", "9557852258596", "9557984608548",
            "9496256446756", "9497643942180", "9329374527780", "9608963752228",
            "9609198108964", "9329373217060", "9433068470564", "9361083138340",
            "9433670877476", "9329377771812", "9559027613988", "9559129227556"
        ],
        "Syringe": [
            "9531013202212", "9554648269092", "9601860763940", "9601869381924",
            "9601858896164", "9329376690468", "9559136731428", "9601132757284",
            "9329384259876", "9433164742948", "9433661210916", "9433129550116",
            "9329383670052", "9329383211300", "9329383637284", "9329383342372",
            "9329383768356", "9433081479460", "9329383833892", "9556615037220"
        ]
    }

    # Create a set of all IDs to keep
    ids_to_keep = set()
    for ids in new_categories.values():
        ids_to_keep.update(ids)

    # Process the data
    new_data = []
    for item in data:
        if item['id'] in ids_to_keep:
            for category, ids in new_categories.items():
                if item['id'] in ids:
                    item['category_name'] = category
                    break
            # Clean the subcategory name
            item['subcategory_name'] = clean_subcategory(item['subcategory_name'])
            new_data.append(item)

    # Write the processed data to the output JSON file
    with open(output_file, 'w') as f:
        json.dump(new_data, f, indent=2)

    print(f"Processed data has been written to {output_file}")

# Usage
input_file = 'input.json'  # Replace with your input file name
output_file = 'output.json'  # Replace with your desired output file name

process_json(input_file, output_file)