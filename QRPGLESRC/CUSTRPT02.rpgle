000100101227     HOPTION(*SRCSTMT:*NODEBUGIO) DFTACTGRP(*NO)                                000202101227     FCUSTSR02  O    E             Printer Infds(@Fp2)                          000203101227     F                                     Oflind(*IN70)                        000204101227     FTRNHSTL1  IF   E           K DISK                                         000205101227     FCUSTS     IF   E           K DISK    prefix(C_)                           000206101224     D*�Program Message Data Structure                                          000207101224     D psds           SDS                                                       000209101224     D sds_pgm               334    343                                         000708101224     D*�Definition of local variables to perform Sorting                        000709110922     D*@PGNBR1         S              4S 0                                      000715101227     D @PGNBR2         S              4S 0                                      000815101230     D UWBCCD          S                   like(xwbccd)                         000915101227     D                                                                          001015101227     D @FP2            DS                                                       001115101227     D  P2@NAM                83     92                                         001215101227     D  P2@OvFlow            188    189B 0                                      001315101227     D  P2@Line              367    368B 0                                      001415101227     D  P2@Page              369    372B 0                                      001515101224      *�Prototype Declaration                                                   001615101224     D*� Entry to program                                                       001715101227     C**************************************************************************001815101230     C     *Entry        Plist                                                  001915101230     C                   Parm                    Uwbccd                         002015101230     C                                                                          002016110922     C**                 Eval      @PgmName1=sds_pgm                            002115101227     C                   Eval      @PgmName2=sds_pgm                            002215101227     C                   Exsr      PrtSR                                        002315101224     C                   Eval      *Inlr=*ON                                    002415101227     C**************************************************************************002515101224     C     PrtSR         Begsr                                                  002615101227     C                   if        Not %Open(CUSTSR02)                          002715101227     C                   Open      CUSTSR02                                     002815101227     C                   Endif                                                  002915101227     C                                                                          003015101227     C                   Eval      @PGNBR2=@PGNBR2+1                            003115101227     C                   write     HDG2                                         003116110913     C**                 if        uwbccd = wbccd                               003315101230     C                   if        uwbccd = *blanks                             003415101230     C     *loval        setll(e)  custs                                        003515101230     C                   read(e)   custs                                        003615101230     C                   else                                                   003715101230     C     uwbccd        setll(e)  custs                                        003815101230     C     uwbccd        reade(e)  custs                                        003915101230     C                   endif                                                  004015101227     C                   dow       not %eof(custs)                              004115101227     C                   eval      XWBCCD = C_XWBCCD                            004215101227     C                   eval      XWBNCD = C_XWBNCD                            004216110922     C**                 eval      XWCNDF = C_XWCNDF                            004315101227     C     k@trnhst      setll(e)  TRNHSTL1                                     004415101227     C     k@trnhst      reade(e)  TRNHSTL1                                     004515101227     C                   dow       not %eof(TRNHSTL1)                           004615101227     C                                                                          004715101227     C                   If        P2@Line >= P2@OvFlow                         004815101227     C                   Eval      @PGNBR2=@PGNBR2+1                            004915101227     C                   Write     HDG2                                         004916110913     C*                  Eval      *IN70=*ON                                    005015101227     C                   Eval      *IN70=*OFF                                   005115101227     C                   Endif                                                  005215101224     C                                                                          005315101227     C                   write     DTL2                                         005415101227     C     k@trnhst      reade(e)  trnhstl1                                     005515101227     C                   Enddo                                                  005615101227     C*�Write Total Records                                                     005815101230     C                   if        uwbccd = *blanks                             006015101230     C                   read(e)   custs                                        006115101230     C                   else                                                   006315101230     C     uwbccd        reade(e)  custs                                        006415101230     C                   endif                                                  006515101227     C                   Enddo                                                  006615101227     C                   write     EOFP2                                        006715101227     C                   Close     CUSTSR02                                     006815101224     C                   Endsr                                                  006915101227     C*�*******************************************************************     007015101224     C*�     Parameter List                                                     007115101224     C*�*******************************************************************     007215101227     C     k@Trnhst      Klist                                                  007315101227     C                   kfld                    XWBNCD                         007415101227     C                   kfld                    XWBCCD                         007515101227     C                                                                          007615101224     C*�*******************************************************************     