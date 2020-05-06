from flask import Flask, render_template, request, json, jsonify, abort, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
# it create an applictation that gets named after this file which is app in this case, __name__ =  'app'
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://postgres:postgres@localhost:5432/todoapp'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
Migrate(app, db)

class Todo(db.Model):
    __tablename__ = 'todo'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(), nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)

    def __repr(self):
        return f'Todo {self.id}: {self.description}'

#to insre that the table are created for all the models we made if they haven't yet been created
# we don't need it with migrate
# db.create_all()

@app.route('/todo/<todo_id>/delete_todo', methods=['DELETE'])
def delete_todo(todo_id):
    try:
        db.session.delete(Todo.query.get(todo_id))
        db.session.commit()
    except:
        session_error()
    finally:
        db.session.close()
    return jsonify({'deleted': True})

@app.route('/todo/<todo_id>/set_completed', methods=['POST'])
def complete(todo_id):
    try:
        isCompleted = request.get_json()['completed']
        todo = Todo.query.get(todo_id)
        todo.completed = isCompleted
        db.session.commit()
    except:
        session_error()
    finally:
        db.session.close()
    return jsonify({
        'completed': isCompleted
    })

def insert_into_db(f1):
    db.session.add(Todo(description=f1))
    db.session.commit()

def session_error():
    import sys
    db.session.rollback()
    print(sys.exec_info()) 
    
@app.route('/todo/create', methods=['POST'])
def create_todo():
    
    # data_dicti = request.get_json()['discription] <-- you can use this instead of those three lines
    data_string = request.data
    data_dictionary = json.loads(data_string)
    x = data_dictionary['description']
    error = False
    try:
        insert_into_db(x)
    except:
        session_error()
        error = False
    finally:
        db.session.close()
    if error:
        abort(400)
    else:
        return jsonify({'description': x})
    
    
@app.route('/')
def index():
    d = Todo.query.order_by('id').all()
    return render_template('index.html', data=d)
 

if __name__ == "__main__":
    app.run()

