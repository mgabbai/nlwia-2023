import { Label } from "@radix-ui/react-label";
import { Separator } from "@radix-ui/react-separator";
import { FileVideo, Upload } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFMpeg } from "../lib/ffmpeg";
import { fetchFile } from '@ffmpeg/util'
import { api } from "../lib/axios";

type tStatus = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessages = {
    waiting: <>Carregar video <Upload className="h-4 w-4 ml-2" /></>,
    converting: 'Convertendo...',
    uploading: 'Carregando...',
    generating: 'Transcrevendo...',
    success: 'Sucesso',
}

export default function VideoInputForm({onVideoUploaded}: {onVideoUploaded: (id: string)=>void}) {

    const [status, setStatus] = useState<tStatus>('waiting')
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const promptInputRef = useRef<HTMLTextAreaElement>(null)

    async function convertVideoToAudio(video: File){
        console.info('Conversion started...')

        const ffmpeg = await getFFMpeg()

        await ffmpeg.writeFile('input.mp4', await fetchFile(video))

        // ffmpeg.on('log', log => console.log(log))
        ffmpeg.on('progress', progress => {
            console.info('Conversion progress: ' + Math.round(progress.progress * 100))
        })

        await ffmpeg.exec([
            '-i', 'input.mp4', '-map', '0:a', '-b:a', '20k', '-acodec', 'libmp3lame',  'output.mp3'
        ])

        const data = await ffmpeg.readFile('output.mp3')

        const audioFileBlob = new Blob([data], {type: 'audio/mpeg'})
        const audioFile = new File([audioFileBlob], 'audio.mp3', {type: 'audio/mpeg'})

        console.info('Conversion finished')

        return audioFile

    }

    async function handleUploadVideo(event: FormEvent<HTMLFormElement>){
        event.preventDefault()

        const prompt = promptInputRef.current?.value

        if(!videoFile){
            return
        }

        setStatus('converting')

        //converter video para audio, para diminuir o tamanho e pegar só o audio do video
        const audioFile = await convertVideoToAudio(videoFile)  
        
        const data = new FormData()

        data.append('file', audioFile)

        setStatus('uploading')
        
        const response = await api.post('/videos', data)

        const videoId = response.data?.video?.id


        setStatus('generating')

        const transcription = await api.post(`/videos/${videoId}/transcription`, { prompt })

        console.log(transcription)

        setStatus('success')

        if(onVideoUploaded) onVideoUploaded(videoId)

    }

    function handleFileSelected(event?: ChangeEvent<HTMLInputElement>){
        const { files } = event?.currentTarget ?? {files: []}

        if(!files){
            return
        }

        const selectedFiles = files[0]
        setVideoFile(selectedFiles)

    }

    const previewURL = useMemo(
        ()=>{
            if(!videoFile) return null
            return URL.createObjectURL(videoFile)
        }, [videoFile]
    )

    return (
        <form className="space-y-4" onSubmit={handleUploadVideo}> 
            <label 
                htmlFor="video"
                className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
            >
                { 
                    previewURL? 
                        <video src={previewURL} controls={false} className="pointer-events-none  inset-0"  /> : 
                        <>
                            <FileVideo className="w-4 h-4"/>
                            Selecione um video
                        </>
                }
            </label>
            <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelected}/>
            <Separator/>
            <div className="space-y-2">
                <Label htmlFor='transcription-prompt'>Prompt de transcrição</Label>
                <Textarea disabled={status !== 'waiting'} ref={promptInputRef} id='transcription-prompt' className="h-20 leading-relaxed" placeholder="Inclua palavras chave mencionadas no video separadas por virgula (,)" />
            </div>
            <Button data-success={status === 'success'} disabled={status !== 'waiting'} className="w-full data-[success=true]:bg-emerald-400" type="submit">
                {
                    statusMessages[status]
                }
            </Button>
        </form>
    )
}