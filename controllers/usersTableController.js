
const usersTableModel = require("../models/usersTableModel")
const sendConfirmationEmail = require("../smtp/createAccount")
const sendForgotPasswordEmail = require("../smtp/forgotPasswordAccount")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const supabase = require("../config/supabaseClient")


const usersTableController = {
    createAccount: async (req, res) => {
        const { password, email } = req.body

        try {
            const response = await usersTableModel.createAccount(password, email)

            if (response.rowCount >= 1) {
                const token = jwt.sign(
                    { email: email },
                    process.env.SECRET,
                    {
                        expiresIn: 3600
                    }
                )
                sendConfirmationEmail(email, token)
                return res.status(200).json({
                    message: "Conta criada, cheque o seu email.",
                    code: "ACCOUNT_CREATED_CHECK_EMAIL"
                })
            }
        } catch (error) {
            if (error.code === "23505") {
                return res.status(409).json({
                    message: "Já existe uma conta com esse email.",
                    code: "ALREADYUSED_EMAIL"
                })
            }
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas. Por favor, tente novamente mais tarde.",
                error: error
            })
        }
        console.log(error)
    },

    loginAccount: async (req, res) => {
        const { password, email } = req.body

        try {
            const response = await usersTableModel.loginAccount(email, password)


            if (response.rowCount >= 1) {
                const token = jwt.sign({ email: email, image: response.rows[0].foto, name: response.rows[0].nome, id: response.rows[0].id_user, username: response.rows[0].username }, process.env.SECRET, { expiresIn: 36000, })
                return res.cookie('auth', token,
                    {
                        sameSite: "none",
                        secure: true,
                        
                        httpOnly: true
                    }).status(200).json({
                        message: "Login realizado com sucesso!",
                        code: "LOGIN_SUCCESS"
                    })
            }

            return res.status(401).json({
                message: "Email ou senha incorretos.",
                code: "INVALID_EMAIL_OR_PASSWORD"
            })

        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString()
            })
        }
    },

    confirmAccount: async (req, res) => {
        const { token } = req.body

        try {
            const response = await usersTableModel.confirmAccount(token)

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    message: "Conta confirmada com sucesso!",
                    code: "CONFIRMED_ACCOUNT"
                })
            }
        } catch (error) {

            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
            })
        }
    },

    forgotPassword: async (req, res) => {
        const { email } = req.body
        try {
            const response = await usersTableModel.forgotPassword(email)
            if (response.rowCount < 1) {
                return res.status(404).json({
                    message: "Email não encontrado.",
                    code: "EMAIL_NOT_FOUND"
                })
            }
            // const resetToken = crypto.randomBytes(32).toString('hex');
            // const { error } = await supabase
            //     .from('password_resets')
            //     .insert([
            //         { email: destinatario, token: resetToken }
            //     ]);
            sendForgotPasswordEmail(email)
            return res.status(200).json({
                message: "Email enviado com sucesso!",
                code: "EMAIL_SENT"
            })
        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            });
        }
    },

    resetPassword: async (req, res) => {
        const { password, email } = req.body

        try {
            const response = await usersTableModel.forgotPasswordAccount(password, email)

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    message: "Senha alterada com sucesso!",
                    code: "PASSWORD_CHANGED"
                })
            }

            return res.status(400).json({
                message: "Falha ao alterar a senha. Por favor, tente novamente.",
                code: "PASSWORD_CHANGE_FAILED"
            })

        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            });
        }
    },

    registerAccount: async (req, res) => {
        const userData = JSON.parse(req.body.userData)
        const {
            nome, estado, nivel, escola, ano, vestibulares, passouVestibular,
            universidade, curso, formouEM, trabalha, instituicao, materiasLecionadas, email
        } = userData

        const photo = req.file;

        try {

            const uploadPhoto = async (photo) => {
                const filePath = `images/${Date.now()}_${photo.originalname}_${email}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("users-photos")
                    .upload(filePath, photo.buffer, {
                        contentType: photo.mimetype,
                        upsert: true,
                    });

                if (uploadError) {
                    throw new Error('Erro ao enviar para o Supabase: ' + uploadError.message);
                }

                const { data: publicUrlData } = supabase.storage
                    .from("users-photos")
                    .getPublicUrl(filePath);

                return publicUrlData.publicUrl;
            };

            let fotoUrl = null;

            if (photo) {
                const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
                if (!allowedTypes.includes(photo.mimetype)) {
                    return res.status(400).json({ error: 'Formato de imagem inválido. Apenas JPEG, PNG e GIF são permitidos.' });
                }

                fotoUrl = await uploadPhoto(photo);

                try {
                    await usersTableModel.updatePhoto(fotoUrl, email)
                } catch (error) {
                    throw new Error("Erro ao atualizar foto." + error)
                }
            }

            const response = await usersTableModel.registerAccount(
                nome, null, estado, nivel, escola, ano, vestibulares, materiasLecionadas,
                passouVestibular, universidade, curso, formouEM, trabalha, instituicao, email
            );

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    message: "Conta registrada com sucesso!",
                    code: "REGISTERED_ACCOUNT"
                });
            }


            return res.status(400).json({
                message: "Falha ao registrar a conta. Por favor, tente novamente."
            });

        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            });
        }
    },

    getUserProfile: async (req, res) => {
        const { username } = req.body

        try {
            const response = await usersTableModel.getUserProfile(username)

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    code: "USER_FOUND",
                    data: response.rows[0]
                })
            }

            return res.status(404).json({
                code: "USER_NOT_FOUND",
                message: "Usuário não encontrado."
            })

        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            });
        }
    },

    chageUserPhoto: async (req, res) => {
        const photo = req.file;
        const token = req.cookies.auth
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret);
        const email = decoded.email
        const id = decoded.id

        const uploadPhoto = async (photo) => {
            const filePath = `images/${Date.now()}_${photo.originalname}_${email}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("users-photos")
                .upload(filePath, photo.buffer, {
                    contentType: photo.mimetype,
                    upsert: true,
                });

            if (uploadError) {
                throw new Error('Erro ao enviar para o Supabase: ' + uploadError.message);
            }

            const { data: publicUrlData } = supabase.storage
                .from("users-photos")
                .getPublicUrl(filePath);

            return publicUrlData.publicUrl;
        };

        try {
            let fotoUrl = null;

            if (photo) {
                const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
                if (!allowedTypes.includes(photo.mimetype)) {
                    return res.status(400).json({ error: 'Formato de imagem inválido. Apenas JPEG, PNG e GIF são permitidos.' });
                }

                fotoUrl = await uploadPhoto(photo);

                try {
                    await usersTableModel.changeUserPhoto(fotoUrl, id)
                } catch (error) {
                    throw new Error("Erro ao atualizar foto." + error)
                }
            }

        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            });
        }
    },

    editProfile: async (req, res) => {
        try {
            const userData = JSON.parse(req.body.userData);
            const { name, descricao } = userData;
            const token = req.cookies.auth;
            const secret = process.env.SECRET;

            const decoded = jwt.verify(token, secret);
            const email = decoded.email;
            const id = decoded.id;

            const foto = req.files?.['foto'];
            const header = req.files?.['header'];

            let fotoUrl = null;
            let headerUrl = null;

            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

            const uploadToSupabase = async (file, type) => {
                if (!allowedTypes.includes(file.mimetype)) {
                    throw new Error(`Formato de imagem inválido (${type}). Apenas JPEG, PNG e GIF são permitidos.`);
                }

                const filePath = `${type}s/${Date.now()}_${file.originalname}_${email}`;
                const { error: uploadError } = await supabase.storage
                    .from("users-photos")
                    .upload(filePath, file.buffer, {
                        contentType: file.mimetype,
                        upsert: true,
                    });

                if (uploadError) {
                    throw new Error(`Erro ao enviar ${type} para o Supabase: ${uploadError.message}`);
                }

                const { data: publicUrlData } = supabase.storage
                    .from("users-photos")
                    .getPublicUrl(filePath);

                return publicUrlData.publicUrl;
            };

            if (foto?.[0]) {
                fotoUrl = await uploadToSupabase(foto[0], 'image');
            }

            if (header?.[0]) {
                headerUrl = await uploadToSupabase(header[0], 'header');
            }

            const updateFields = { nome: name };

            if (descricao) updateFields.descricao = descricao;
            if (fotoUrl) updateFields.foto = fotoUrl;
            if (headerUrl) updateFields.header = headerUrl;

            const response = await usersTableModel.editProfileDynamic(updateFields, id);


            if (response.rowCount >= 1) {
                return res.status(200).json({
                    message: "Perfil editado com sucesso!",
                    code: "PROFILE_EDITED",
                });
            }

            return res.status(404).json({
                message: "Não foi possível editar o perfil",
                code: "EDITED_ERROR",
            });
        } catch (error) {
            return res.status(500).json({
                message: "Estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            });
        }
    }
}

module.exports = usersTableController
