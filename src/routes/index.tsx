import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { DataTable } from "../pages/DataTable";
import { Profile } from "../pages/Profile";
import { PostList } from "../pages/posts/PostList";
import { Post3 } from "../pages/posts/Post3";
import { Posts } from "../pages/posts/Posts";


export function MainRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<DataTable entity="users" />} />
            <Route path="/depts" element={<DataTable entity="departments" />} />
            <Route path="/profile" element={ <Profile />} />
            <Route path="/posts" element={< PostList entity="posts" />} />
            <Route path="/posts2" element={< Posts entity="posts" />} />

            <Route path="/post3" element={<Post3 />} />
        </Routes>
    );
}