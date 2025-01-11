import os
import json
import random
import string
import tkinter as tk
from tkinter import messagebox, simpledialog, ttk
from cryptography.fernet import Fernet
from datetime import datetime

# Generate and store a key if it doesn't exist
def load_or_generate_key():
    key_file = "key.key"
    if not os.path.exists(key_file):
        key = Fernet.generate_key()
        with open(key_file, "wb") as f:
            f.write(key)
    else:
        with open(key_file, "rb") as f:
            key = f.read()
    return key

key = load_or_generate_key()
cipher_suite = Fernet(key)

def save_passwords(passwords):
    with open("passwords.json", "wb") as f:
        encrypted_data = cipher_suite.encrypt(json.dumps(passwords).encode())
        f.write(encrypted_data)

def load_passwords():
    if not os.path.exists("passwords.json"):
        return {}
    with open("passwords.json", "rb") as f:
        encrypted_data = f.read()
        decrypted_data = cipher_suite.decrypt(encrypted_data).decode()
        return json.loads(decrypted_data)

def generate_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for _ in range(length))

def add_password_gui():
    service = simpledialog.askstring("Add Password", "Enter the service name:")
    if not service:
        return
    username = simpledialog.askstring("Add Password", "Enter the username:")
    if not username:
        return
    password = simpledialog.askstring("Add Password", "Enter the password (leave blank to generate):")
    if not password:
        password = generate_password()
        messagebox.showinfo("Generated Password", f"Generated Password: {password}")

    passwords = load_passwords()
    passwords[service] = {
        "username": username,
        "password": password,
        "last_edit": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    save_passwords(passwords)
    messagebox.showinfo("Success", f"Password for {service} added successfully.")
    refresh_table()

def modify_password_gui(service):
    passwords = load_passwords()
    if service not in passwords:
        messagebox.showerror("Error", f"No password found for {service}.")
        return

    username = simpledialog.askstring("Modify Password", "Enter the new username:", initialvalue=passwords[service].get('username', ''))
    if not username:
        return
    password = simpledialog.askstring("Modify Password", "Enter the new password (leave blank to generate):")
    if not password:
        password = generate_password()
        messagebox.showinfo("Generated Password", f"Generated Password: {password}")

    passwords[service] = {
        "username": username,
        "password": password,
        "last_edit": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    save_passwords(passwords)
    messagebox.showinfo("Success", f"Password for {service} modified successfully.")
    refresh_table()

def copy_to_clipboard(root, text):
    root.clipboard_clear()
    root.clipboard_append(text)
    root.update()  # Keep the clipboard content available after the app closes
    messagebox.showinfo("Copied", "Password copied to clipboard!")

def refresh_table():
    for row in tree.get_children():
        tree.delete(row)
    passwords = load_passwords()
    for service, creds in passwords.items():
        tree.insert("", "end", text=service, values=(creds.get('username', ''), creds.get('last_edit', 'N/A')))

def on_item_select(event):
    selected_item = tree.selection()
    if selected_item:
        service = tree.item(selected_item[0], 'text')
        passwords = load_passwords()
        if service not in passwords:
            messagebox.showerror("Error", f"No password found for {service}.")
            return
        action = messagebox.askquestion("Action", f"What do you want to do with {service}?", icon='question', type='yesnocancel', \
                                        default='cancel', detail="Yes = Copy Password, No = Modify")
        if action == 'yes':
            copy_to_clipboard(root, passwords[service]['password'])
        elif action == 'no':
            modify_password_gui(service)

def main_gui():
    global root, tree
    root = tk.Tk()
    root.title("Password Manager")

    frame = tk.Frame(root, padx=20, pady=20)
    frame.pack(fill=tk.BOTH, expand=True)

    tree = ttk.Treeview(frame, columns=("Username", "Last Edit"), show="tree headings")
    tree.heading("#0", text="Service")
    tree.heading("Username", text="Username")
    tree.heading("Last Edit", text="Last Edit")

    tree.pack(fill=tk.BOTH, expand=True)
    tree.bind("<Double-1>", on_item_select)

    button_frame = tk.Frame(frame, pady=10)
    button_frame.pack(fill=tk.X)

    add_button = tk.Button(button_frame, text="Add Password", width=20, command=add_password_gui)
    add_button.pack(side=tk.LEFT, padx=10, pady=5)

    exit_button = tk.Button(button_frame, text="Exit", width=20, command=root.quit)
    exit_button.pack(side=tk.RIGHT, padx=10, pady=5)

    refresh_table()
    root.mainloop()

if __name__ == "__main__":
    main_gui()
