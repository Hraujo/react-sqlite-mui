import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { UserList } from "../pages/users/UserList";
import { Profile } from "../pages/Profile";
import { PostList } from "../pages/posts/PostList";



export function MainRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UserList entity="users" />} />
            <Route path="/depts" element={<UserList entity="departments" />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/posts" element={< PostList entity="posts" />} />
        </Routes>
    );
}