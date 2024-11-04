import { cn } from "@/lib/utils";
import React, { ReactNode, useMemo } from "react";

import { Playlist } from "@/lib/store/playlist-store";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "@radix-ui/react-icons";
import { useSongStore } from "@/lib/store/song-store";
import usePlaylists from "@/lib/hooks/use-playlists";
import { coverAsStyle, parseGeneratedCoverString } from "@/lib/gradient";

const playlistBannerVariants = cva("", {
    variants: {
        size: {
            xs: "min-h-4 min-w-4 max-h-4 max-w-4 w-4 h-4",
            sm: "min-h-4 min-w-4 max-h-8 max-w-8 w-8 h-8",
            md: "min-h-12 min-w-12 max-h-12 max-w-12 w-12 h-12",
            lg: "min-h-[6rem] min-w-[6rem] max-h-[6rem] max-w-[6rem] w-[6rem] h-[6rem]",
            xl: "min-h-[10rem] min-w-[10rem] max-h-[10rem] max-w-[10rem] w-[10rem] h-[10rem]",
        },
    },
    defaultVariants: {
        size: "md",
    },
});

interface PlaylistBannerProps
    extends React.ButtonHTMLAttributes<HTMLDivElement>,
        VariantProps<typeof playlistBannerVariants> {
    playlist: Playlist;
    className?: string;
    playButton?: boolean;
    playButtonHover?: boolean;
}

const PlaylistBanner = ({
    playlist,
    className,
    size,
    playButton = false,
    playButtonHover = false,
    ...props
}: PlaylistBannerProps) => {
    const songsList = useSongStore.use.songs();
    const { playPlaylist, getPlaylistSongs } = usePlaylists();

    const playlistSongs = useMemo(() => {
        return getPlaylistSongs(playlist.id);
    }, [playlist]);

    const renderBanner = () => {
        switch (playlistSongs.length) {
            case 0:
                return <div className="w-full h-full bg-popover/50"></div>;
            case 1: {
                const s = songsList.find((x) => x.id == playlistSongs[0]);
                return (
                    <div
                        className="w-full h-full"
                        style={
                            s &&
                            coverAsStyle(parseGeneratedCoverString(s.cover))
                        }
                    ></div>
                );
            }
            case 2: {
                const [s1, s2] = playlistSongs.map((id) =>
                    songsList.find((x) => x.id == id)
                );
                return (
                    <div className="w-full h-full">
                        <div className="grid grid-cols-2 w-full h-full">
                            <div
                                className="w-full h-full"
                                style={
                                    s1 &&
                                    coverAsStyle(
                                        parseGeneratedCoverString(s1.cover)
                                    )
                                }
                            ></div>
                            <div
                                className="w-full h-full"
                                style={
                                    s2 &&
                                    coverAsStyle(
                                        parseGeneratedCoverString(s2.cover)
                                    )
                                }
                            ></div>
                        </div>
                    </div>
                );
            }
            case 3: {
                const [s1, s2, s3] = playlistSongs.map((id) =>
                    songsList.find((x) => x.id == id)
                );
                return (
                    <div className="grid grid-rows-2 h-full w-full">
                        <div className="grid grid-cols-2 w-full h-full">
                            <div
                                className="w-full h-full"
                                style={
                                    s1 &&
                                    coverAsStyle(
                                        parseGeneratedCoverString(s1.cover)
                                    )
                                }
                            ></div>
                            <div
                                className="w-full h-full"
                                style={
                                    s2 &&
                                    coverAsStyle(
                                        parseGeneratedCoverString(s2.cover)
                                    )
                                }
                            ></div>
                        </div>
                        <div className="w-full">
                            <div
                                className="w-full h-full"
                                style={
                                    s3 &&
                                    coverAsStyle(
                                        parseGeneratedCoverString(s3.cover)
                                    )
                                }
                            ></div>
                        </div>
                    </div>
                );
            }
            default: {
                const [s1, s2, s3, s4] = playlistSongs
                    .slice(0, 4)
                    .map((id) => songsList.find((x) => x.id == id));
                return (
                    <div className="grid grid-rows-2 w-full h-full">
                        <div className="grid grid-cols-2 w-full h-full">
                            <div
                                className="w-full h-full"
                                style={
                                    s1 &&
                                    coverAsStyle(
                                        parseGeneratedCoverString(s1.cover)
                                    )
                                }
                            ></div>
                            <div
                                className="w-full h-full"
                                style={
                                    s2 &&
                                    coverAsStyle(
                                        parseGeneratedCoverString(s2.cover)
                                    )
                                }
                            ></div>
                        </div>
                        <div className="grid grid-cols-2 w-full">
                            <div
                                className="w-full h-full"
                                style={
                                    s3 &&
                                    coverAsStyle(
                                        parseGeneratedCoverString(s3.cover)
                                    )
                                }
                            ></div>
                            <div
                                className="w-full h-full"
                                style={
                                    s4 &&
                                    coverAsStyle(
                                        parseGeneratedCoverString(s4.cover)
                                    )
                                }
                            ></div>
                        </div>
                    </div>
                );
            }
        }
    };

    // TODO : should this be here?
    const handlePlay = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        playPlaylist(playlist.id);
    };

    return (
        <div
            className={cn(
                playlistBannerVariants({ size: size }),
                "relative",
                "rounded-[10px] overflow-hidden group ",
                className
            )}
            {...props}
        >
            {/* {element} */}
            {renderBanner()}
            {(playButtonHover || playButton) && (
                <div
                    className={cn(
                        "z-40 peer absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]",
                        { "hidden group-hover:block": playButtonHover }
                    )}
                >
                    <Button
                        onClick={(e) => handlePlay(e)}
                        size={"icon"}
                        className="rounded-full hover:bg-background hover:text-foreground"
                        variant={"ghost"}
                    >
                        <PlayIcon className="size-5" />
                    </Button>
                </div>
            )}
            {(playButtonHover || playButton) && (
                <div className="w-full h-full hover:backdrop-brightness-75 absolute z-20 peer-hover:backdrop-brightness-75 top-0 rounded-[10px]"></div>
            )}
        </div>
    );
};

const playlistDetailVariants = cva(
    "text-ellipsis overflow-hidden whitespace-nowrap",
    {
        variants: {
            length: {
                default: "max-w-[4.7rem]    ",
                long: "max-w-[8rem] ",
                "extra-long": "max-w-[10rem] ",
                full: "w-full",
            },
        },
        defaultVariants: {
            length: "default",
        },
    }
);

interface PlaylistDetailProps
    extends React.ButtonHTMLAttributes<HTMLDivElement>,
        VariantProps<typeof playlistDetailVariants> {
    playlist: Playlist;
    className?: string;
}

const PlaylistDetail = ({
    playlist,
    className,
    length,
    ...props
}: PlaylistDetailProps) => {
    return (
        <div
            className={cn(
                "flex flex-col leading-tight justify-center",
                className
            )}
            {...props}
        >
            <span
                className={cn(
                    "text-muted-foreground text-xs",
                    playlistDetailVariants({ length })
                )}
            >
                Playlist
            </span>
            <span
                className={cn(playlistDetailVariants({ length }), "pb-2 pl-1")}
            >
                {playlist.title}
            </span>
        </div>
    );
};

const PlaylistHeader = ({
    className,
    children,
}: {
    className?: string;
    children?: ReactNode;
}) => {
    return (
        <div className={cn("w-full", className)}>
            <div className="flex gap-2">{children}</div>
        </div>
    );
};

export { PlaylistBanner, PlaylistDetail, PlaylistHeader };
