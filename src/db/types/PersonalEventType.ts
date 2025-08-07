export type CreatePersonalEventType = {
    id_user: string
    day: string
    month: string
    year: string
    title: string
    cursinho: string
    descricao: string
    foto: string
    link: string
    type: string
    color: string
    main_title: string
}

export type CreatePersonalLocalEventType = CreatePersonalEventType & {
    isImportant: boolean
    hora: string
}