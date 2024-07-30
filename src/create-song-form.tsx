import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { useSongStore } from "./lib/store/song-store";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "./components/ui/use-toast";

const formSchema = z.object({
  source: z
    .string()
    .min(1, "Source name must be at least 1 character.")
    .max(150, "Source name must be less than 150 characters."),
  title: z
    .string()
    .min(1, "Title must be at least 1 character.")
    .max(150, "Title must be less than 150 characters."),
  content: z
    .string()
    .min(1, "Content must be at least 1 character.")
    .max(8000, "Content must be less than 8000 characters."),
});

type formSchemaType = z.infer<typeof formSchema>;

export default function CreateSongForm() {
  const songStore = useSongStore();
  const { toast } = useToast();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: "",
      title: "",
      content: "",
    },
  });

  function onSubmit(values: formSchemaType) {
    console.log(values);

    songStore.addSong({
      id: uuidv4(),
      title: values.title,
      content: values.content,
      source: values.source,
    });

    form.reset();
    toast({
      title: "Successfully added your song.",
      description: `${values.title} - ${values.source}`,
      variant: "success",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription className="sr-only">
                This is the name of the song.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription className="sr-only">
                This is the name of the source of the song.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription className="sr-only">
                This is the content of the song. It is what you will be typing.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
