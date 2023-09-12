import { Button } from "./components/ui/button";
import {Github,FileVideo, Upload, Wand2} from 'lucide-react'
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";


export function App() {

  return (
    <div className="min-h-screen flex flex-col">
        <div className="px-6 py-3 flex items-center justify-between border-b">
            <h1 className="text-xl font-bold">Upload AI</h1>
            <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Desenvolvido com ❤️ no NLW da Rocketseat</span>
                <Separator orientation='vertical' className='h-6' />
                <Button variant={'outline'}>
                    <Github className="w-4 h-4 mr-2"/>
                    Github
                </Button>
            </div>
        </div>
        <main className="flex-1 p-6 flex gap-6">
            <div className="flex flex-col flex-1 gap-4">
                <div className="grid grid-rows gap-4 flex-1">
                    <Textarea className="resize-none p-4 leading-relaxed" placeholder="Inclua o prompt para a IA"/>
                    <Textarea className="resize-none p-4 leading-relaxed" placeholder="Resultado gerado pela IA" readOnly/>
                </div>
                <p className="text-sm text-muted-foreground">
                    Lembre-se voce pode utilizar a variavel <code className="text-violet-400">{`{transcription}`}</code> no seu prompt para adicionar o conteudo da transcrição do video selecionado
                </p>
            </div>
            <aside className="w-80 space-y-6">
                <form className="space-y-4">
                    <label 
                        htmlFor="video"
                        className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
                    >
                        <FileVideo className="w-4 h-4"/>
                        Selecione um video
                    </label>
                    <input type="file" id="video" accept="video/mp4" className="sr-only"/>
                    <Separator/>
                    <div className="space-y-2">
                        <Label htmlFor='transcription-prompt'>Prompt de transcrição</Label>
                        <Textarea id='transcription-prompt' className="h-20 leading-relaxed" placeholder="Inclua palavras chave mencionadas no video separadas por virgula (,)" />
                    </div>
                    <Button className="w-full" type="submit">
                        Carregar video <Upload className="h-4 w-4 ml-2" />
                    </Button>
                </form>
                <Separator/>
                <form className="space-y-4">
                    <div className="space-y-2">
                        <Label>Prompt</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder='Selecione um promp' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="title">Titulo</SelectItem>
                                <SelectItem value="description">Descrição</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Modelo</Label>
                        <Select disabled defaultValue="gpt3.5">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="block text-xs text-muted-foreground">Voce podera customizar essa opção em breve</span>
                    </div>
                    <Separator/>
                    <div className="space-y-4">
                        <Label>Temperatura</Label>
                        <Slider 
                            min={0}
                            max={1}
                            step={0.1}
                        />
                        <span className="block text-xs text-muted-foreground leading-relaxed">Valores mais altos tendem a deixar o resultado mais criativo e com possiveis erros</span>
                    </div>
                    <Separator/>
                    <Button type="submit" className="w-full">Executar <Wand2 className="h-4 w-4 ml-2" /> </Button>
                </form>
            </aside>
        </main>
    </div>
  )
}


