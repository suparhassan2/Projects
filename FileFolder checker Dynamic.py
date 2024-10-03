import os
from datetime import datetime, timedelta

def get_last_business_day():
    # Get today's date
    today = datetime.today()

    # Calculate the previous business day
    if today.weekday() == 0:  # Monday
        last_business_day = today - timedelta(days=3)  # Go back to Friday
    elif today.weekday() == 6:  # Sunday
        last_business_day = today - timedelta(days=2)  # Go back to Friday
    else:
        last_business_day = today - timedelta(days=1)  # Go back 1 day (normally)

    # If it's a Saturday or Sunday, adjust accordingly (already handled)
    return last_business_day

def check_missing_files(base_folder_path, base_filenames, file_extension, date_format):
    # Get the last business day
    target_date = get_last_business_day()

    # Format the date for the folder name and the filenames
    formatted_date = target_date.strftime(date_format)

    # Generate the full folder path based on the date
    folder_path = os.path.join(base_folder_path, formatted_date)

    # Generate expected filenames with the date appended
    expected_files = [f"{base_name} {formatted_date}.{file_extension}" for base_name in base_filenames]

    # Check if the folder exists
    if not os.path.exists(folder_path):
        print(f"Folder '{folder_path}' does not exist.")
        return

    # Get a list of files in the folder
    files_in_folder = os.listdir(folder_path)

    # Check for missing files
    missing_files = [file for file in expected_files if file not in files_in_folder]

    if missing_files:
        print("Missing files:")
        for file in missing_files:
            print(file)
    else:
        print("All files are present.")

# Example usage:
base_folder_path = "path_to_base_folder"  # Replace with the path to the base folder (where date-named folders are stored)
base_filenames = [
    'FILE1', 'FILE2', 'FILE3', 'FILE4', 'FILE5',
    'FILE6', 'FILE7', 'FILE8', 'FILE9', 'FILE10',
    'FILE11', 'FILE12', 'FILE13', 'FILE14', 'FILE15',
    'FILE16', 'FILE17', 'FILE18'
]  # Replace with the actual base names of the files (without date and extension)

file_extension = "XLSM"  # Replace with the actual file extension
date_format = "%b %d"  # Format for the date (e.g., "OCT 01" -> "%b %d")

check_missing_files(base_folder_path, base_filenames, file_extension, date_format)
