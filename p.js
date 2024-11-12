import { BrowserRouter, Routes, Route } from "react-router-dom";
return (
    <>
      <NoteState>
        <BrowserRouter>
          <Navbar />
          
            <Routes>

              <Route caseSensitive={false} path="/" element={<Home />} />
              <Route caseSensitive={false} path="/about" element={<About />} />
              <Route caseSensitive={false} path="/login" element={<Login />} />
              <Route caseSensitive={false} path="/signup" element={<Signup show={show} />}/>

            </Routes>

        </BrowserRouter>
      </NoteState>
    </>
  );