from flask import Flask, render_template, request, jsonify, redirect
import sqlite3
import connection
import json
# from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)

# app.secret_key = "flask-1234"
# CSRFProtect(app)


@app.route('/')
def home():
    conn = connection.connect()
    cursor = conn.cursor()
    fetch_user_query = "SELECT id, full_name, phone FROM users ORDER BY id;"
    cursor.execute(fetch_user_query)

    the_list = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('index.html', users=the_list)


@app.route('/adduser/', methods=['POST'])
def add_user():
    conn = connection.connect()
    cursor = conn.cursor()
    
    full_name = request.form.get('full_name')
    phone = request.form.get('phone')
    data = [full_name, phone]

    add_user_query = "insert into users (full_name, phone) values (?, ?);"
    cursor.execute(add_user_query, data)
    conn.commit()


    cursor.close()
    conn.close()

    success = 1
    return jsonify(success)

@app.route('/fetch/', methods=['GET'])
def fetch():
    conn = connection.connect()
    cursor = conn.cursor()
    
    fetch_user_query = "select id, full_name, phone from users where delete_date is NULL order by id;"
    cursor.execute(fetch_user_query)

    the_list = []
    for users in cursor:
        the_list.append(users)

    cursor.close()
    conn.close()

    return jsonify(the_list)



# @app.route('/fetch-one/<id>/', methods=['GET'])
# def fetch_one(id):
#     conn = connection.connect()
#     cursor = conn.cursor()

#     fetch_user_query = f"select id, full_name, phone from users where delete_date is NULL and id='{id}'"
#     cursor.execute(fetch_user_query)

#     the_user = []
#     for user in cursor:
#         the_user.append(user)
#     return render_template('modal.html', user=the_user)



@app.route('/fetch-one/<id>/', methods=['GET'])
def fetch_one(id):
    conn = connection.connect()
    cursor = conn.cursor()

    fetch_user_query = f"select id, full_name, phone from users where delete_date is NULL and id='{id}'"
    cursor.execute(fetch_user_query)

    the_user = []
    for user in cursor:
        the_user.append(user)
    return jsonify(the_user)
    




@app.route('/update/', methods=['POST', 'GET'])
def update():
    try:
        conn = connection.connect()
        cursor = conn.cursor()
        if request.method == 'POST':
            field = request.form['field']
            value = request.form['value']
            userid = request.form['id']
            if field == 'nameinput':
                update_query = "UPDATE users SET full_name=? WHERE id=?;"
                cursor.execute(update_query, (value, userid))
                conn.commit()
            elif field == 'phoneinput':
                print("field is phoneinput")
                update_query = "UPDATE users SET phone=? WHERE id=?;"
                cursor.execute(update_query, (value, userid))
                conn.commit()
            success = 1
        else:
            return redirect('/')
        return jsonify(success)
    except Exception as e:
        return jsonify(str(e))
    finally:
        cursor.close()
        conn.close()



@app.route('/update-name/<id>/', methods=['POST', 'GET'])
def update_name(id):
    try:
        conn = connection.connect()
        cursor = conn.cursor()
        if request.method == 'POST':
            value = request.form['name_input']
            update_query = "UPDATE users SET full_name=? WHERE id=?;"
            cursor.execute(update_query, (value, id))
            conn.commit()
        else:
            return redirect('/')
        return redirect('/')
    except Exception as e:
        return jsonify(str(e))
    finally:
        cursor.close()
        conn.close()


@app.route('/update-phone/<id>/', methods=['POST', 'GET'])
def update_phone(id):
    try:
        conn = connection.connect()
        cursor = conn.cursor()
        if request.method == 'POST':
            value = request.form['phone_input']
            update_query = "UPDATE users SET phone=? WHERE id=?;"
            cursor.execute(update_query, (value, id))
            conn.commit()
        else:
            return redirect('/')
        return redirect('/')
    except Exception as e:
        return jsonify(str(e))
    finally:
        cursor.close()
        conn.close()




@app.route('/delete-user/<id>/', methods=['POST'])
def delete_user(id):
    try:
        conn = connection.connect()
        cursor = conn.cursor()

        from datetime import datetime
        now = datetime.today().strftime('%Y-%m-%d %H:%M:%S')
        delete_query = f"""UPDATE users SET delete_date=\"{now}\" WHERE id=\"{id}\""""
        print(f"""UPDATE users SET delete_date=\"{now}\" WHERE id=\"{id}\"""")
        cursor.execute(delete_query)
        conn.commit()
        success = 1
        return jsonify(success)
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()




if __name__ == "__main__":
    app.run(debug=True, port=8000)
