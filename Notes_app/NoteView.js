export default class NoteView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
            <div class="noteApp__sidebar">
                <button class="noteApp__addNote" type="button">Add Note</button>
                <div class="noteApp__list"></div>
            </div>
            <div class="noteApp__preview">
                <input class="noteApp__inputTitle" type="text" placeholder="New Note...">
                <textarea class="noteApp__inputBody">Take Note...</textarea>
            </div>
        `;

        const btnAddNote = this.root.querySelector(".noteApp__addNote");
        const inpTitle = this.root.querySelector(".noteApp__inputTitle");
        const inpBody = this.root.querySelector(".noteApp__inputBody");

        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        [inpTitle, inpBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });

        this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;

        return `
            <div class="noteApp__listItem" data-note-id="${id}">
                <div class="noteApp__title">${title}</div>
                <div class="noteApp__body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="noteApp__updatedTime">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".noteApp__list");

        notesListContainer.innerHTML = "";

        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));
            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        notesListContainer.querySelectorAll(".noteApp__listItem").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");
                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
        });
    }

    updateActiveNote(note) {
        this.root.querySelector(".noteApp__inputTitle").value = note.title;
        this.root.querySelector(".noteApp__inputBody").value = note.body;

        this.root.querySelectorAll(".noteApp__listItem").forEach(noteListItem => {
            noteListItem.classList.remove("noteApp__listItem--active");
        });

        this.root.querySelector(`.noteApp__listItem[data-note-id="${note.id}"]`).classList.add("noteApp__listItem--active");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".noteApp__preview").style.visibility = visible ? "visible" : "hidden";
    }
}
