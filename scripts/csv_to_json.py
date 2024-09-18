import csv
import json
import random

def generate_location():
    return f"{random.randint(1, 5):02d}.{random.randint(1, 20):02d}.{random.randint(1, 20):02d}"

def convert_csv_to_json(input_file, output_file):
    json_data = []

    with open(input_file, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            product_id = row['Product ID'].split('/')[-1]
            json_item = {
                "id": product_id,
                "subcategory_name": row['Title'],
                "category_name": row['Category'],
                "location": generate_location(),
                "image_url": row['Image URL']
            }
            json_data.append(json_item)

    # Save the JSON data to a file
    with open(output_file, 'w') as jsonfile:
        json.dump(json_data, jsonfile, indent=2)

    print(f"Data has been successfully saved to {output_file}")

    return json_data

# Example usage
input_csv = 'products.csv'
output_json = 'products.json'

result = convert_csv_to_json(input_csv, output_json)

# Print the first few items of the result to verify
print("\nFirst few items of the converted data:")
print(json.dumps(result[:3], indent=2))