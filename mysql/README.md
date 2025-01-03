## Running phpmyadmin

Installation:

```bash
# Installing from brew doesn't work out of the box, so we install from apt instead
# https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-phpmyadmin-on-ubuntu-20-04
sudo apt install apache2
# https://stackoverflow.com/questions/11657829/error-2002-hy000-cant-connect-to-local-mysql-server-through-socket-var-run
sudo apt install mysql-server mysql-client
sudo apt install php libapache2-mod-php php-mysql
sudo apt install phpmyadmin php-mbstring php-zip php-gd php-json php-curl
sudo systemctl restart apache2
```

Run apache:

```bash
sudo systemctl enable apache2
sudo service mysql start
```

## Connecting to mysql

Configure mysql to allow connection without sudo

```bash
# https://stackoverflow.com/questions/41645309/mysql-error-access-denied-for-user-rootlocalhost
sudo mysql
# The following use 'mypassword' as password
SELECT user,authentication_string,plugin,host FROM mysql.user;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mypassword';
FLUSH PRIVILEGES;
```

To solve the "Access denied for user 'phpmyadmin'@'localhost'" error in phpmyadmin, create a `phpmyadmin` user without a password here:
http://localhost/phpmyadmin/index.php?route=/server/privileges&viewing_mode=server

Then, to connect manually to mysql:

```bash
mysql -u root
```
