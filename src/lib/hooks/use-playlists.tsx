import React from "react";
import { Playlist, usePlaylistStore } from "../store/playlist-store";
import { useQueueStore } from "../store/queue-store";
import { useSongStore } from "../store/song-store";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export default function usePlaylists() {
    // IDK what to name the funcs since they do the same stuff, editPlaylist and editPlaylist, so maybe _ prefix for from store
    const _editPlaylist = usePlaylistStore.use.editPlaylist();
    const playlists = usePlaylistStore.use.playlists();
    const _deleteAllPlaylists = usePlaylistStore.use.deleteAllPlaylists();

    const _deletePlaylist = usePlaylistStore.use.deletePlaylist();
    const enqueue = useQueueStore.use.enqueue();
    const setCurrent = useQueueStore.use.setCurrent();
    const setSongs = useQueueStore.use.setSongs();
    const songsList = useSongStore.use.songs();
    const addPlaylist = usePlaylistStore.use.addPlaylist();
    const navigate = useNavigate();

    const playPlaylist = (
        playlistID: string,
        enqueuePlaylist?: boolean,
        playFirstSong?: boolean
    ) => {
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

        const playlistSongs = getPlaylistSongs(playlist.id);

        playlistSongs.reverse().forEach((songID) => {
            if (songsList.find((x) => x.id == songID) != undefined) {
                enqueue(songID);
            }
        });

        if (!enqueuePlaylist && playlistSongs.length > 0) {
            setCurrent(playlistSongs[0]);
            navigate("/");
        }
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
            description: `Playlist: ${playlist.title}`,
            action: (
                <Link to={`/songs/playlist/${playlist.id}`}>
                    <Button variant={"outline"}>View playlist</Button>
                </Link>
            ),
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

    const getPlaylistSongsWithData = (playlistID: string) => {
        const validPlaylistSongs = getPlaylistSongs(playlistID);

        return validPlaylistSongs
            .map((songID) => songsList.find((song) => song.id == songID))
            .filter((song) => song != undefined);
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
        _deletePlaylist(playlistID);
    };

    const deleteAllPlaylists = () => {
        _deleteAllPlaylists();
    };

    const editPlaylist = (playlist: Playlist) => {
        _editPlaylist({ ...playlist, lastModifiedAt: Date.now() });
    };

    // TODO : should I use immer for stuff like editPlaylist, should it be directly on the store or here?
    return {
        getPlaylist,
        addToPlaylist,
        removeFromPlaylist,
        deletePlaylist,
        playPlaylist,
        createPlaylist,
        getPlaylistSongs,
        getPlaylistSongsWithData,
        editPlaylist,
        deleteAllPlaylists,
    };
}
