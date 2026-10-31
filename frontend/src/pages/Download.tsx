import { Apple, Download as DownloadIcon, ExternalLink, Monitor } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Platform = 'windows' | 'mac' | 'linux'

interface DownloadItem {
  platform: string
  url: string
  label: string
}

interface Product {
  id: string
  name: string
  version: string
  description: string
  releaseUrl: string
  checksumsUrl?: string
  downloads: Record<Platform, DownloadItem[]>
  notes?: ReactNode
}

const OPENALGO_DESKTOP_VERSION = '1.0.5'
const openalgoDesktopBase = `https://github.com/marketcalls/openalgo-desktop/releases/download/v${OPENALGO_DESKTOP_VERSION}`
const openalgoDesktopFile = (suffix: string) =>
  `${openalgoDesktopBase}/OpenAlgo.Desktop_${OPENALGO_DESKTOP_VERSION}_${suffix}`

const FASTSCALPER_VERSION = '0.1.0'
const fastscalperBase = `https://github.com/marketcalls/fastscalper-tauri/releases/download/v${FASTSCALPER_VERSION}`

const products: Product[] = [
  {
    id: 'openalgo-desktop',
    name: 'OpenAlgo Desktop',
    version: OPENALGO_DESKTOP_VERSION,
    description:
      'OpenAlgo on your own computer. Install, sign in, connect your broker and trade: no server to set up, no Python to install. The same screens, API and market data feed as OpenAlgo web.',
    releaseUrl: `https://github.com/marketcalls/openalgo-desktop/releases/tag/v${OPENALGO_DESKTOP_VERSION}`,
    checksumsUrl: `${openalgoDesktopBase}/SHA256SUMS.txt`,
    downloads: {
      windows: [
        {
          platform: 'Windows x64',
          url: openalgoDesktopFile('x64-setup.exe'),
          label: 'Download EXE',
        },
      ],
      mac: [
        {
          platform: 'macOS Apple Silicon (M1 and later)',
          url: openalgoDesktopFile('aarch64.dmg'),
          label: 'Download DMG',
        },
        {
          platform: 'macOS Intel',
          url: openalgoDesktopFile('x64.dmg'),
          label: 'Download DMG',
        },
      ],
      linux: [
        {
          platform: 'Ubuntu / Debian x64',
          url: openalgoDesktopFile('amd64.deb'),
          label: 'Download DEB',
        },
        {
          platform: 'AppImage x64',
          url: openalgoDesktopFile('amd64.AppImage'),
          label: 'Download AppImage',
        },
        {
          platform: 'Ubuntu / Debian ARM64',
          url: openalgoDesktopFile('arm64.deb'),
          label: 'Download DEB',
        },
        {
          platform: 'AppImage ARM64',
          url: openalgoDesktopFile('aarch64.AppImage'),
          label: 'Download AppImage',
        },
      ],
    },
    notes: (
      <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          The installers are not code-signed yet, so Windows and macOS show a warning the first time
          the app is opened.
        </li>
        <li>
          On an Apple Silicon Mac, if macOS says the app &quot;is damaged and can&apos;t be
          opened&quot;, the file is not damaged: the app is not yet notarized by Apple. Do not move
          it to the Trash. In Terminal, run{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground">
            xattr -dr com.apple.quarantine &quot;/Applications/OpenAlgo Desktop.app&quot;
          </code>{' '}
          and open the app again.{' '}
          <a
            href="https://docs.openalgo.in/openalgo-desktop/install-on-macos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            Step by step guide
          </a>
          .
        </li>
        <li>Already installed? OpenAlgo Desktop offers new versions as an in-app update.</li>
      </ul>
    ),
  },
  {
    id: 'fastscalper',
    name: 'FastScalper Desktop',
    version: FASTSCALPER_VERSION,
    description: 'A fast, Rust based desktop scalping app that connects to your OpenAlgo.',
    releaseUrl: `https://github.com/marketcalls/fastscalper-tauri/releases/tag/v${FASTSCALPER_VERSION}`,
    downloads: {
      windows: [
        {
          platform: 'Windows (MSI)',
          url: `${fastscalperBase}/fastscalper_${FASTSCALPER_VERSION}_x64_en-US.msi`,
          label: 'Download MSI',
        },
        {
          platform: 'Windows (EXE)',
          url: `${fastscalperBase}/fastscalper_${FASTSCALPER_VERSION}_x64-setup.exe`,
          label: 'Download EXE',
        },
      ],
      mac: [
        {
          platform: 'Mac Universal',
          url: `${fastscalperBase}/fastscalper_${FASTSCALPER_VERSION}_universal.dmg`,
          label: 'Download DMG',
        },
        {
          platform: 'Mac Universal (Portable)',
          url: `${fastscalperBase}/fastscalper_${FASTSCALPER_VERSION}_universal_mac.zip`,
          label: 'Download ZIP',
        },
      ],
      linux: [
        {
          platform: 'Ubuntu / Debian',
          url: `${fastscalperBase}/fastscalper_${FASTSCALPER_VERSION}_amd64.deb`,
          label: 'Download DEB',
        },
        {
          platform: 'Fedora / Red Hat',
          url: `${fastscalperBase}/fastscalper-${FASTSCALPER_VERSION}-1.x86_64.rpm`,
          label: 'Download RPM',
        },
        {
          platform: 'AppImage',
          url: `${fastscalperBase}/fastscalper_${FASTSCALPER_VERSION}_amd64.AppImage`,
          label: 'Download AppImage',
        },
      ],
    },
  },
]

const platformOrder: Platform[] = ['windows', 'mac', 'linux']

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'windows'
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('mac')) return 'mac'
  if (ua.includes('linux') && !ua.includes('android')) return 'linux'
  return 'windows'
}

function PlatformLabel({ platform }: { platform: Platform }) {
  if (platform === 'mac') {
    return (
      <>
        <Apple className="h-4 w-4" />
        macOS
      </>
    )
  }
  if (platform === 'linux') {
    return (
      <>
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
        </svg>
        Linux
      </>
    )
  }
  return (
    <>
      <Monitor className="h-4 w-4" />
      Windows
    </>
  )
}

function ProductDownloads({ product }: { product: Product }) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(detectPlatform)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <Badge variant="secondary">v{product.version}</Badge>
            </div>
            <CardDescription>{product.description}</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <a href={product.releaseUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Release notes
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          value={selectedPlatform}
          onValueChange={(value) => setSelectedPlatform(value as Platform)}
        >
          <TabsList className="mb-6 grid w-full grid-cols-3">
            {platformOrder.map((platform) => (
              <TabsTrigger key={platform} value={platform} className="flex items-center gap-2">
                <PlatformLabel platform={platform} />
              </TabsTrigger>
            ))}
          </TabsList>

          {platformOrder.map((platform) => (
            <TabsContent key={platform} value={platform}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Platform</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead className="text-right">Download</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.downloads[platform].map((item) => (
                      <TableRow key={item.url}>
                        <TableCell className="font-medium">{item.platform}</TableCell>
                        <TableCell>v{product.version}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" asChild>
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              <DownloadIcon className="mr-2 h-4 w-4" />
                              {item.label}
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {product.notes}

        {product.checksumsUrl && (
          <p className="text-sm text-muted-foreground">
            To check a download, compare its checksum with{' '}
            <a
              href={product.checksumsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              SHA256SUMS.txt
            </a>
            .
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function Download() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-center text-4xl font-bold">
        OpenAlgo <span className="text-primary">Downloads</span>
      </h1>
      <p className="mb-8 text-center text-muted-foreground">
        Desktop apps for Windows, macOS and Linux.
      </p>

      <div className="space-y-8">
        {products.map((product) => (
          <ProductDownloads key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
