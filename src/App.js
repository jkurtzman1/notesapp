import { useState, useEffect } from 'react';
import './App.css';
import Note from './components/Note';
import noteService from "./services/notes"


const App = (props) =>
{
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(false);

  const hook = () =>
  {
    noteService
    .getAll()
    .then(initalNotes => {
      setNotes(initalNotes);
    });
  }
  useEffect(hook, []);
  //console.log('render', notes.length, 'notes');

  const notesToShow = showAll ? notes : 
    notes.filter(note => note.important);

  const addNote = (e) =>
  {
    e.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1
    };

    //setNotes(notes.concat(noteObject));
    noteService.create(noteObject)
         .then(returnedNote => {
          setNotes(notes.concat(returnedNote));
          setNewNote('');
         });
  }

  const handleNoteChange = (e) =>
  {
    //console.log(e.target.value);
    setNewNote(e.target.value);
  }

  const toggleImportanceOf = (id) =>
  {
    const note = notes.find(note => note.id === id);
    const changedNote = {...note, important: !note.important};

    noteService.update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote));
      });
  }

  return(
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      <form onSubmit={addNote}>
          <input value={newNote} onChange={handleNoteChange}/>
          <button type='submit'>save</button>
      </form>
    </div>
  );
}

export default App;
