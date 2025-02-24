const url = 'http://localhost:5151/api/notes';

function createRandomNote() {
  return {
    title: `Test Note ${Math.floor(Math.random() * 1000)}`,
    content: `Test Note body ${Math.floor(Math.random() * 1000)}`
  };
}

function createNoteAndDeleteAfter15Seconds(note) {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Created:', data);
    setTimeout(() => {
      fetch(`${url}/${data.id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          console.log(`Deleted note with ID: ${data.id}`);
        } else {
          console.error('Error deleting:', response.statusText);
        }
      })
      .catch(error => console.error('Error deleting:', error));
    }, 15000); // 15 seconds
  })
  .catch(error => console.error('Error creating:', error));
}

let stop = false; 

process.stdin.setRawMode(true); 
process.stdin.resume(); 
process.stdin.on('data', () => {
  stop = true; 
  process.stdin.setRawMode(false); 
  process.stdin.pause(); 
  console.log('Stopping the creation and deletion of notes');
}); 



async function createAndDeleteNotes(){
  while(!stop){
    const note = createRandomNote(); 
    createNoteAndDeleteAfter15Seconds(note); 
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second before creating the next note
  }
}

createAndDeleteNotes();