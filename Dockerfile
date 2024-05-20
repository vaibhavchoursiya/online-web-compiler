FROM ubuntu

# Update package list
RUN apt-get update

# Install essential development tools
RUN apt-get install -y build-essential

# Install Python
RUN apt-get install -y python3

# Install C and C++ compilers
RUN apt-get install -y gcc g++

# Install OpenJDK for Java
RUN apt-get install -y openjdk-11-jdk

# Install Ruby
RUN apt-get install -y ruby

CMD ["tail", "-f", "/dev/null"]