import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Youtube, ExternalLink, Presentation, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ViewCounter } from "@/components/view-counter"

export default function EmoSenseLinks() {
  const links = [
    {
      title: "GitHub Repo",
      url: "https://github.com/YoussefSalem582/Emosense-App",
      icon: Github,
    },
    {
      title: "LinkedIn Post",
      url: "https://www.linkedin.com/posts/youssef-hassan-8529372b7_emosense-app-document-activity-7352709254396506113-POpB",
      icon: Linkedin,
    },
    {
      title: "YouTube Demo Video",
      url: "https://lnkd.in/e_PZWwEV",
      icon: Youtube,
    },
    {
      title: "App Presentation",
      url: "https://www.canva.com/design/DAGsVBL0Yfk/VGF3COosMMTMp2bvVoOXRQ/edit?utm_content=DAGsVBL0Yfk&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
      icon: Presentation,
    },
    {
      title: "App Document PDF",
      url: "https://drive.google.com/file/d/1B8BjPMIPI_epCI8DFtV2VPH1wwiw05HG/view?usp=sharing",
      icon: FileText,
    },
  ]

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <Image
            src="/images/app-icon.png"
            alt="EmoSense App Logo"
            width={120}
            height={120}
            className="rounded-2xl mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">EmoSense App Links</h1>
        </div>

        <ViewCounter />

        {links.map((link, index) => (
          <Card key={index} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
            <CardContent className="p-0">
              <Link href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex items-center p-4">
                  <link.icon className="w-5 h-5 text-white mr-4" />
                  <span className="text-white font-medium flex-1">{link.title}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
