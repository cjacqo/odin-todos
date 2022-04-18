import Database from "."

const Folders = [
    {
        id: 0,
        name: 'Folder 1',
        items: []
    },
    {
        id: 1,
        name: 'Folder 2',
        items: []
    },
    {
        id: 2,
        name: 'Folder 3',
        items: []
    },
    {
        id: 3,
        name: 'Folder 4',
        items: []
    },
]

const Items = [
    {
        id: 0,
        name: 'Item 1',
        folder_id: 0
    },
    {
        id: 1,
        name: 'Item 2',
        folder_id: 0
    },
    {
        id: 2,
        name: 'Item 3',
        folder_id: 1
    },
    {
        id: 3,
        name: 'Item 4',
        folder_id: 2
    },
]

const Forms = [
    {
        formId: 'todo',
        formName: 'Todo',
        formInfo: ['Details'],
        fieldSets: [
            {
                id: 0,
                questions: [
                    {
                        inputType: 'text',
                        attributes: [
                            { name: 'required', value: true },
                            { name: 'minlength', value: 1 },
                            { name: 'maxlength', value: 20 },
                            { name: 'placeholder', value: 'Title' },
                            { name: 'id', value: 'todoName' },
                            { name: 'name', value: 'item-name-input' },
                        ],
                        options: null,
                        title: null
                    },
                    {
                        inputType: 'textarea',
                        attributes: [
                            { name: 'required', value: false },
                            { name: 'minlength', value: 1 },
                            { name: 'maxlength', value: 40 },
                            { name: 'placeholder', value: 'Notes' },
                            { name: 'id', value: 'todoNote' },
                            { name: 'name', value: 'item-note' },
                        ],
                        options: null,
                        title: null
                    }
                ]
            },
            {
                id: 1,
                questions: [
                    {
                        inputType: 'date',
                        attributes: null,
                        options: null,
                        title: null
                    },
                    {
                        inputType: 'time',
                        attributes: null,
                        options: null,
                        title: null
                    }
                ]
            },
            {
                id: 2,
                questions: [
                    {
                        inputType: 'priority',
                        attributes: [
                            { name: 'required', value: false },
                            { name: 'name', value: 'priority-select' },
                            { name: 'id', value: 'toDoPrioritySelect' },
                        ],
                        options: ['none', 'low', 'medium', 'high'],
                        title: 'Priority'
                    },
                    {
                        inputType: 'folder-select',
                        attributes: [
                            { name: 'required', value: false },
                            { name: 'name', value: 'folder-select' },
                            { name: 'id', value: 'todoFolderSelect' },
                        ],
                        options: Database.getEditableFolders(),
                        title: 'Add to Folder'
                    }
                ]
            }
        ],
        formInfo: ['Details'],
        buttons: [
            {
                type: 'button',
                value: 'close',
                text: 'Cancel'
            },
            {
                type: 'submit',
                text: 'Done',
                creationValue: 'todo'
            }
        ]
    },
    {
        formId: 'note',
        formName: 'Note',
        fieldSets: [
            {
                id: 0,
                questions: [
                    {
                        inputType: 'text',
                        attributes: [
                            { name: 'required', value: true },
                            { name: 'type', value: 'text' },
                            { name: 'minlength', value: 1 },
                            { name: 'maxlength', value: 30 },
                            { name: 'id', value: 'noteTitle' },
                            { name: 'name', value: 'note-title-input' }
                        ]
                    }
                ]
            },
            {
                id: 1,
                questions: [
                    {
                        inputType: 'textarea',
                        attributes: [
                            { name: 'required', value: true},
                            { name: 'minlength', value: 1 },
                            { name: 'placeholder', value: null },
                            { name: 'id', value: 'noteNote' },
                            { name: 'name', value: 'note-note-input' }
                        ]
                    }
                ]
            }
        ]
    }
]

export { Folders, Items, Forms } 