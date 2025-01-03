import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import useImportSongs from "@/lib/hooks/use-import-songs"
import { PlusIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { UploadIcon } from "lucide-react"

export default function DropZone() {
    const [fileSelectError, setFileSelectError] = useState("")
    const { processJSONfile, clear, imported, error } = useImportSongs()

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length == 0) {
            // Shouldn't happen but yk
            setFileSelectError("Selected too many files. Single JSON file at a time.")
            return
        }

        const file = acceptedFiles[0]
        processJSONfile(file)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,

        onError: (e) => {
            // TODO : idk onError doesn't get called
            setFileSelectError(e.name + e.message)
        },
    })

    const handleTryAgain = () => {
        setFileSelectError("")
        clear()
    }

    if (fileSelectError != "" || error != "") {
        return (
            <div className="w-full flex flex-col justify-center items-center gap-12 border sm:p-4 p-2 rounded-sm backdrop-brightness-75">
                <div className="flex flex-col items-center justify-center  ">
                    <Alert variant={"destructive"}>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            <span>{fileSelectError}</span>
                            {fileSelectError && error && <br />}
                            <span>{error}</span>
                        </AlertDescription>
                    </Alert>
                </div>
                <div className="flex gap-3">
                    <Button className="space-x-2" onClick={handleTryAgain}>
                        <span>Try again</span>
                    </Button>
                </div>
            </div>
        )
    }

    if (imported != "") {
        return (
            <div className="w-full flex flex-col justify-center items-center gap-12 border p-2 rounded-sm">
                <div className="flex flex-col items-center justify-center">
                    <span className="text-lg">Successfully imported your songs.</span>
                    <span className="text-muted-foreground">Imported ({imported}) songs.</span>
                    <span className="text-muted-foreground text-xs mt-8 max-w-[18rem]">
                        *If the result is less than expected, there may be incorrect values or formatting issues in the JSON file.
                    </span>
                </div>
                <div className="flex gap-3">
                    <Link to={`/songs`}>
                        <Button variant={"secondary"}>View songs list</Button>
                    </Link>
                    <Button className="space-x-2" onClick={handleTryAgain}>
                        <PlusIcon /> <span>Import more</span>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div
                {...getRootProps()}
                className="border-dashed border p-8 flex justify-center items-center w-full hover:ring ring-primary cursor-pointer rounded-lg"
            >
                <input {...getInputProps()} className="border" />
                {isDragActive ? (
                    <div className="flex justify-center items-center flex-col gap-4 select-none">
                        <div className="p-3 border rounded-[var(--radius)] w-fit">
                            <UploadIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-center flex-col text-center">
                            <p>Drop the files here...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center flex-col gap-4 select-none">
                        <div className="p-3 border rounded-[var(--radius)] w-fit">
                            <UploadIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-center flex-col text-center">
                            <p>Drag 'n' drop the files here, or click to select the files.</p>
                            <p className="text-muted-foreground text-xs text-center">Only JSON files allowed.</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
