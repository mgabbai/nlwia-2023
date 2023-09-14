import { useEffect, useState } from 'react'
import { api } from '../lib/axios'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface iPrompts {
    id: string
    title: string
    template: string
}

export default function PromptSelect({onPromptSelected}: {onPromptSelected: (template: string)=>void}) {

    const [prompts, setPrompts] = useState<iPrompts[] | null>(null)

    useEffect(
        () => {
            api.get('/prompts').then(response => setPrompts(response.data))
        }, []
    )

    function handlePromptSelected(promptId: string){
        const selectedPrompt = prompts?.find(p => p.id === promptId)

        if(!selectedPrompt) return

        if(onPromptSelected) onPromptSelected(selectedPrompt.template)
    }

    return (
        <Select onValueChange={handlePromptSelected}>
            <SelectTrigger>
                <SelectValue placeholder='Selecione um promp' />
            </SelectTrigger>
            <SelectContent>
                {
                    prompts?.map(prompt => <SelectItem key={prompt.id} value={prompt.id}>{prompt.title}</SelectItem>)
                }
                
            </SelectContent>
        </Select>
    )
}
