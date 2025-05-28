import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 justify-center p-4">
      <h1>Hello world</h1>
      <Button>I am a button</Button>
      <Input placeholder="I am an input" />
      <Progress value={50} />
      <Textarea value="I am a textarea" />
    </div>
  );
}
