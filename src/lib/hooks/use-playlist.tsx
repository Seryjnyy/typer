import React from "react";
import { Playlist, usePlaylistStore } from "../store/playlist-store";
import { useQueueStore } from "../store/queue-store";
import { useSongStore } from "../store/song-store";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function usePlaylist() {
    const editPlaylist = usePlaylistStore.use.editPlaylist();
    const playlists = usePlaylistStore.use.playlists();
    const deletePlaylistForever = usePlaylistStore.use.deletePlaylist();
    const enqueue = useQueueStore.use.enqueue();
    const setSongs = useQueueStore.use.setSongs();
    const songsList = useSongStore.use.songs();
    const addPlaylist = usePlaylistStore.use.addPlaylist();

    const playPlaylist = (playlistID: string, enqueuePlaylist?: boolean) => {
        const playlist = getPlaylist(playlistID);

        if (!playlist) {
            console.error("Couldn't find playlist.");
            return;
        }

        // Clear the queue if we are not enqueueing the playlist
        if (!enqueuePlaylist) {
            setSongs([]);
        }

        // Need to check if songs exist before playing them
        // TODO : probably not efficient to reverse but eh
        playlist.dontUsesDirectlySongs.reverse().forEach((songID) => {
            if (songsList.find((x) => x.id == songID) != undefined) {
                enqueue(songID);
            }
        });
    };

    const getPlaylist = (playlistID: string) => {
        return playlists.find((x) => x.id == playlistID);
    };

    const addToPlaylist = (playlistID: string, songID: string) => {
        const playlist = getPlaylist(playlistID);

        if (!playlist) {
            console.error("Couldn't find playlist.");
            toast({
                title: "Couldn't find playlist..",
            });
            return;
        }

        const playlistSongs = getPlaylistSongs(playlistID);

        if (playlistSongs.includes(songID)) {
            console.warn("Song already in playlist.");
            toast({
                title: "Song is already in the playlist.",
            });
            return;
        }

        editPlaylist({
            ...playlist,
            dontUsesDirectlySongs: [...playlistSongs, songID],
        });
        toast({
            title: "Song added to playlist.",
        });
    };

    const removeFromPlaylist = (playlistID: string, songID: string) => {
        const playlist = getPlaylist(playlistID);

        if (!playlist) {
            console.error("Couldn't find playlist.");
            return;
        }

        const playlistSongs = getPlaylistSongs(playlistID);

        editPlaylist({
            ...playlist,
            dontUsesDirectlySongs: [
                ...playlistSongs.filter((x) => x != songID),
            ],
        });
    };

    // Need to do have a special function to get the playlist songs because there could be some invalid songs there
    // Since there are no foreign keys and stuff right now or any checks on song deletion playlist can have old invalid data
    const getPlaylistSongs = (playlistID: string) => {
        const playlist = getPlaylist(playlistID);

        if (!playlist) {
            console.error("Couldn't find playlist.");
            return [];
        }

        const validSongIDs = playlist.dontUsesDirectlySongs
            .map((songID) => songsList.find((song) => song.id == songID)?.id)
            .filter((x) => x != undefined);

        // There was some invalid songs in the playlist, replace playlist songs with only the valid ones
        if (validSongIDs.length != playlist.dontUsesDirectlySongs.length) {
            editPlaylist({ ...playlist, dontUsesDirectlySongs: validSongIDs });
        }

        return validSongIDs;
    };

    const createPlaylist = ({
        title,
        songs,
    }: {
        title: string;
        songs?: string[];
    }) => {
        // Check if songs being added to playlist actually exist, only get the ones that do
        const checkedSongs = songs
            ? songs?.filter((songId) => {
                  return songsList.find((x) => x.id == songId) != undefined;
              })
            : [];

        const playlist: Playlist = {
            id: uuidv4(),
            title: title,
            dontUsesDirectlySongs: checkedSongs,
            createdAt: Date.now(),
            lastModifiedAt: Date.now(),
        };

        addPlaylist(playlist);

        toast({
            title: "Successfully created playlist",
            description: "And added the song to it.",
            action: (
                <Link to={`/songs/playlist/${playlist.id}`}>
                    <Button variant={"outline"}>View playlist</Button>
                </Link>
            ),
        });
    };

    const deletePlaylist = (playlistID: string) => {
        deletePlaylistForever(playlistID);
    };

    return {
        addToPlaylist,
        removeFromPlaylist,
        deletePlaylist,
        playPlaylist,
        createPlaylist,
        getPlaylistSongs,
    };
}
