
[[#std filesystem C++17]]
1. [[#Path]]

# std::filesystem C++17#
#std_filesystem

Предоставляет стандартный способ управления файлами, каталогами и путями в файловой системе.
Пример копирования большого файла во временный путь:
```c++
const auto bigFilePath {"bigFileToCopy"};

if (std::filesystem::exists(bigFilePath)) {   
  const auto bigFileSize {std::filesystem::file_size(bigFilePath)};
  std::filesystem::path tmpPath {"/tmp"};
  
  if (std::filesystem::space(tmpPath).available > bigFileSize) {
    std::filesystem::create_directory(tmpPath.append("example"));
    std::filesystem::copy_file(bigFilePath, tmpPath.append("newFile"));
  }
}
```



## Path
#Path

