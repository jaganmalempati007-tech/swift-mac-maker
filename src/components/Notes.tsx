import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const savedNotes = localStorage.getItem('productivity-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('productivity-notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    if (title.trim() === '') return;
    
    const newNote: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content,
      createdAt: new Date(),
    };
    
    setNotes([newNote, ...notes]);
    setTitle('');
    setContent('');
    setSelectedNote(newNote);
  };

  const updateNote = () => {
    if (!selectedNote || title.trim() === '') return;
    
    const updatedNotes = notes.map(note =>
      note.id === selectedNote.id
        ? { ...note, title: title.trim(), content }
        : note
    );
    
    setNotes(updatedNotes);
    setSelectedNote({ ...selectedNote, title: title.trim(), content });
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setTitle('');
      setContent('');
    }
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
        <div className="space-y-2">
          <h3 className="font-semibold">Notes</h3>
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {notes.map(note => (
              <div
                key={note.id}
                className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                  selectedNote?.id === note.id ? 'bg-accent' : 'bg-muted hover:bg-accent'
                }`}
                onClick={() => selectNote(note)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{note.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1"
            />
            <Button onClick={selectedNote ? updateNote : createNewNote}>
              {selectedNote ? 'Update' : <Plus className="h-4 w-4" />}
            </Button>
          </div>
          <Textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-72 resize-none"
          />
        </div>
      </div>
    </Card>
  );
};

export default Notes;