import dbfunctions


def accountinit():
    tables = {
        "accounts" : (
                None,
                "AccountsDB",
                "CREATE TABLE AccountsDB(AccountID TEXT unique not null, Username TEXT unique not null, Password TEXT not null)",
                ),
        "logins" : (
                None,
                "LoginsDB",
                "CREATE TABLE LoginsDB(LoginID INTEGER unique not null, AccountID TEXT not null)"
            )
        }
    try:
        for key in tables:
            print("passing:", *tables[key])
            dbfunctions.createTable(*tables[key])
    except Exception as e:
        print(e)

accountinit()