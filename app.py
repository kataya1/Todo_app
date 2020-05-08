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
    completed = db.Column(db.Boolean, default=False)
    list_id = db.Column(db.Integer, db.ForeignKey('todolist.id'), nullable=False)

    def __repr__(self):
        return f'Todo {self.id}: {self.description} (completed: {self.completed})'


class TodoList(db.Model):
    __tablename__ = 'todolist'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), nullable=False)
    todos = db.relationship('Todo', backref='list', cascade='all, delete-orphan')

#to insre that the table are created for all the models we made if they haven't yet been created
# we don't need it with migrate
# db.create_all()

def session_error(e):
    db.session.rollback()
    print(e.msg) 

ltdict = {
    'todo': Todo,
    'list': TodoList
}
@app.route('/delete/<var>/<id>', methods=['DELETE'])
def delete(var, id):
    try:
        db.session.delete(ltdict[var].query.get(id))
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

    
@app.route('/todo/create/<list_id>', methods=['POST'])
def create_todo(list_id):
    # data_dicti = request.get_json()['discription] <-- you can use this instead of those three lines
    data_string = request.data
    data_dictionary = json.loads(data_string)
    x = data_dictionary['description']
    error = False
    try:
        t =Todo(description=x)
        l = TodoList.query.get(list_id)
        t.list = l
        db.session.add(t)
        db.session.commit()
    except Exception as e:
        session_error(e)
        error = False
    finally:
        db.session.close()
    if error:
        abort(400)
    else:
        return jsonify({'description': x})

@app.route('/list/create', methods=['POST'])
def create_list():
    x = request.get_json()['name'] # <-- you can use this instead of those three lines
    error = False
    try:
        db.session.add(TodoList(name=x))
        db.session.commit()
    except Exception as e:
        session_error(e)
        error = False
    finally:
        db.session.close()
    if error:
        abort(400)
    else:
        return jsonify({'name': x})

@app.route('/list/<list_id>')   
def get_todo_list(list_id):
    d = Todo.query.filter_by(list_id=list_id).order_by('id').all()
    l = TodoList.query.order_by('id').all()
    active_list = TodoList.query.get(list_id)
    return render_template('index.html', todos=d, lists=l, active_list=active_list)

@app.route('/')
def index():
    return redirect(url_for('get_todo_list', list_id=1))
 

if __name__ == "__main__":
    app.run()

